import * as ts from 'typescript';
import {SyntaxKind, TokenFlags} from 'typescript';
import {cloneNode} from "ts-clone-node";

ts.SyntaxKind.NoSubstitutionTemplateLiteral;

declare module 'typescript' {
    /* @internal */
    function isExpression(node: ts.Node): node is ts.Expression;
}

function setOriginalNode<T extends ts.Node>(node: T, original: ts.Node | undefined): T {
    if (node == original)
        return node;
    return ts.setOriginalNode(node, original);
}

function setImmediateParent<T extends ts.Node | ts.Node[]>(nodes: T, parent: ts.Node): T {
    for (const node of 'length' in nodes ? nodes as ts.Node[] : [nodes as ts.Node]) {
        (node as any).parent = parent;
    }
    return nodes;
}

// function fixParentsRecursively<T extends ts.Node | ts.Node[]>(nodes: T, ctx: ts.TransformationContext): T {
//     const visitor = (parent: ts.Node) => (node: ts.Node) => {
//         (node as any).parent = parent;
//         ts.visitEachChild(node, visitor(node), ctx)
//         return undefined;
//     }
//     for (const node of 'length' in nodes ? nodes as ts.Node[] : [nodes as ts.Node]) {
//         ts.visitEachChild(node, visitor(node), ctx)
//     }
// }

interface TransformerConfig {
    jsDocTagNames: {
        inline: string;
        inlineAsBlock: string;
        inlineAsImmediatelyInvokedArrowFunction: string;
        lazy: string;
        inspectable: string;
        specialGetCallSiteDetails: string;
    }
}

const defaultOpts = {
    jsDocTagNames: {
        inline: 'inline',
        inlineAsBlock: 'inline-as-block',
        inlineAsImmediatelyInvokedArrowFunction: 'inline-as-func',
        lazy: 'lazy',
        inspectable: 'inspectable',
        specialGetCallSiteDetails: 'inline-special-getCallSiteDetails',
    }
};

const makeTransformerFactory = (program: ts.Program, optsIn?: TransformerConfig) => (ctx: ts.TransformationContext) => (sourceFile: ts.SourceFile) => {
    const f = ctx.factory;
    const opts: TransformerConfig = {...defaultOpts, ...optsIn};
    const checker = program.getTypeChecker();
    const printer = ts.createPrinter();

    interface InlineableFunctionParamInfo {
        sym: ts.Symbol;
        decl: ts.ParameterDeclaration;
        isLazy: boolean;
        isInspectable: boolean;
    }

    class InlineableFunctionInfo {
        public readonly hasReturns: boolean;
        public readonly externalSymbolsByInternalIdentifer = new Map<ts.Identifier, ts.Symbol>();
        public readonly parameterInfosByIdentifier = new Map<ts.Identifier, InlineableFunctionParamInfo>();
        public readonly parameterInfos: Array<InlineableFunctionParamInfo>;
        public readonly getCallSiteDetailsIdents = new Set<ts.Identifier>();

        constructor(public decl: ts.FunctionDeclaration) {
            if (decl.body === undefined)
                throw new Error(`ts-inline: Could not find body for function declaration`);

            this.hasReturns = !!forEachChildRecursive(decl.body, node => {
                if (ts.isReturnStatement(node))
                    return true;

                return;
            });

            const parameterInfosBySymbol = new Map<ts.Symbol, InlineableFunctionParamInfo>();
            this.parameterInfos = decl.parameters.map(paramDecl => {
                const sym = checker.getSymbolAtLocation(paramDecl.name);
                if (!sym)
                    throw new Error('wtf');

                const tags = ts.getJSDocTags(paramDecl);
                const isLazy = tags.some(tag => tag.tagName.text == opts.jsDocTagNames.lazy);
                const isInspectable = tags.some(tag => tag.tagName.text == opts.jsDocTagNames.inspectable);

                const info = {sym, decl: paramDecl, isLazy, isInspectable};
                parameterInfosBySymbol.set(sym, info);
                return info;
            });

            forEachChildRecursive(decl.body, node => {
                if (!ts.isIdentifier(node))
                    return;

                if (ts.isPropertyAccessExpression(node.parent) && node == node.parent.name)
                    return;

                const symbol = checker.getSymbolAtLocation(node);
                if (!symbol || !(symbol.getFlags() & ts.SymbolFlags.Value))
                    return;

                let hasDeclarationsWithout = false;
                for (const symDecl of symbol.getDeclarations() ?? []) {
                    let curr = symDecl.parent;
                    let within = false;
                    while (curr) {
                        if (curr == decl) {
                            within = true;
                            break;
                        }
                        curr = curr.parent;
                    }
                    if (within) {
                        if (ts.isParameter(symDecl)) {
                            const paramInfo = parameterInfosBySymbol.get(symbol)!;
                            if (paramInfo.isLazy
                                && ts.isBinaryExpression(node.parent)
                                && node.parent.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
                                && node.parent.operatorToken.kind <= ts.SyntaxKind.LastAssignment
                                && node == node.parent.left)
                                throw new Error(`ts-inline: detected modification of @lazy param in @inline'd function -- this won't work!`);
                            this.parameterInfosByIdentifier.set(node, paramInfo);
                        }
                    } else {
                        hasDeclarationsWithout = true;
                        const isGetCallSiteDetailsCall = ts.getJSDocTags(symDecl).some(tag => tag.tagName.text == opts.jsDocTagNames.specialGetCallSiteDetails);
                        if (isGetCallSiteDetailsCall)
                            this.getCallSiteDetailsIdents.add(node);
                    }
                }
                if (hasDeclarationsWithout)
                    this.externalSymbolsByInternalIdentifer.set(node, symbol);
            });
        }
    }

    const inlineableFunctionInfos = new Map<ts.FunctionDeclaration, InlineableFunctionInfo>();

    const inlineTagSet = new Set([
        opts.jsDocTagNames.inline,
        opts.jsDocTagNames.inlineAsBlock,
        opts.jsDocTagNames.inlineAsImmediatelyInvokedArrowFunction,
    ]);

    const maybePrepareFunctionDeclarationForInlining = (node: ts.Node): ts.Node[] | null => {
        if (!ts.isFunctionDeclaration(node))
            return null;

        const inlineTags = ts.getJSDocTags(node).filter(tag => inlineTagSet.has(tag.tagName.text));
        if (inlineTags.length == 0)
            return null;

        if (!node.body)
            throw new Error(`ts-inline: Cannot inline function declarations without a body`);

        if (!node.name)
            throw new Error(`ts-inline: Cannot inline function declarations without a name`);

        let declInfo = getOrPut(inlineableFunctionInfos, node, () => new InlineableFunctionInfo(node));

        const externalSymbolsToAttach = new Map<ts.Symbol, ts.Identifier>([...declInfo!.externalSymbolsByInternalIdentifer.entries()].map(([ident, sym]) => [sym, ident]));

        return [
            node,
            ...[...externalSymbolsToAttach.values()].map(ident => f.createCallExpression(
                f.createPropertyAccessExpression(f.createIdentifier('Object'), 'defineProperty'),
                undefined,
                [
                    node.name!,
                    f.createStringLiteral(`upvalue_${ident.text}`, true),
                    f.createObjectLiteralExpression([
                        f.createMethodDeclaration(
                            undefined, undefined, undefined, 'get',
                            undefined, undefined, [], undefined,
                            f.createBlock([
                                f.createReturnStatement(ident)
                            ])
                        ),
                        f.createMethodDeclaration(
                            undefined, undefined, undefined, 'set',
                            undefined, undefined, [
                                f.createParameterDeclaration(undefined, undefined, undefined, 'v')
                            ], undefined,
                            f.createBlock([
                                f.createExpressionStatement(f.createAssignment(
                                    ident, f.createIdentifier('v'),
                                ))
                            ])
                        ),
                    ])
                ]
            )),
        ];
    };

    const checkFunctionDeclarationJSDocTagsFromCallExpression = (callExpr: ts.CallExpression, check: (tag: ts.JSDocTag) => boolean) => {
        const signature = checker.getResolvedSignature(callExpr);
        if (signature === undefined)
            return null;

        const decl = signature.declaration;
        if (decl === undefined)
            return null;

        const inlineTags = ts.getJSDocTags(decl).filter(check);
        if (inlineTags.length == 0)
            return null;

        switch (decl.kind) {
            case ts.SyntaxKind.FunctionDeclaration:
                // ok
                break;

            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.Constructor:
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
            case ts.SyntaxKind.ArrowFunction:
            default:
                throw new Error(`ts-inline: Cannot yet handle inlining of functions defined using a ts.SyntaxKind.${ts.SyntaxKind[decl.kind]} visitNode`);
        }

        return {inlineTags, decl};
    };

    const maybeInlineCallExpression = (visitNode: ts.Node): ts.Node | null => {
        let callNode: ts.CallExpression, containingNode;
        let areWeVisitingParent;
        if (ts.isCallExpression(visitNode)) {
            areWeVisitingParent = false;
            callNode = visitNode;
            containingNode = visitNode.parent;
        } else if (ts.isExpressionStatement(visitNode) && ts.isCallExpression(visitNode.expression)) {
            areWeVisitingParent = true;
            callNode = visitNode.expression;
            containingNode = visitNode;
        } else {
            return null;
        }

        const check = checkFunctionDeclarationJSDocTagsFromCallExpression(callNode, tag => inlineTagSet.has(tag.tagName.text));
        if (check == null) return null;
        const {inlineTags, decl} = check;

        let declInfo = getOrPut(inlineableFunctionInfos, decl, () => new InlineableFunctionInfo(decl));

        const mustBeBlock = inlineTags.some(tag => tag.tagName.text == opts.jsDocTagNames.inlineAsBlock);
        const mustBeArrowFunc = inlineTags.some(tag => tag.tagName.text == opts.jsDocTagNames.inlineAsImmediatelyInvokedArrowFunction);
        if (mustBeBlock && mustBeArrowFunc)
            throw new Error(`ts-inline: cannot specify both ${opts.jsDocTagNames.inlineAsBlock} and ${opts.jsDocTagNames.inlineAsImmediatelyInvokedArrowFunction}`);

        const needsCallSiteDetails = (declInfo.getCallSiteDetailsIdents.size > 0);
        const getCallSiteDetailsIdent = [...declInfo.getCallSiteDetailsIdents.values()][0];
        const paramAccessReplacements = new Map<InlineableFunctionParamInfo, ts.Expression>();

        interface ParamPart {
            node: ts.Node;
            result: ts.Node;
            pretty: string;
            ident: ts.Identifier;
            children: ParamPart[];
        }

        interface ParamDetails {
            name: string;
            rootPart: ParamPart;
        }

        const callSiteParamDetails: ParamDetails[] = [];

        const varDecs = [];

        const createTempVar = (name: string) => {
            return f.createUniqueName(name, ts.GeneratedIdentifierFlags.Optimistic);
            // return f.createTempVariable(undefined);
        };

        let unevaluatedShorthand: ts.Identifier;
        if (needsCallSiteDetails) {
            unevaluatedShorthand = createTempVar('U');
            varDecs.push(f.createVariableDeclaration(
                unevaluatedShorthand, undefined, undefined,
                f.createPropertyAccessExpression(f.createPropertyAccessExpression(callNode.expression, `upvalue_${getCallSiteDetailsIdent.text}`), 'UNEVALUATED')
            ));
        }

        for (const [paramIdx, paramInfo] of declInfo.parameterInfos.entries()) {
            const replacementIdent = createTempVar(paramInfo.decl.name.getText());

            let callValue = callNode.arguments[paramIdx];
            if (callValue === undefined)
                callValue = f.createVoidZero();

            if (needsCallSiteDetails && paramInfo.isInspectable) {
                let rootPart: ParamPart | undefined = undefined;
                const stack: ParamPart[] = [];
                const deepInspectVisitor: (parent: ts.Node) => ts.Visitor = parent => node => {
                    let result;
                    // if (ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
                    //     result = node;
                    if (
                        node.kind >= ts.SyntaxKind.FirstTypeNode && node.kind <= ts.SyntaxKind.LastTypeNode
                        || ts.isParameter(node)
                        || ts.isClassExpression(node)
                    ) {
                        result = node;
                        // } else if (ts.isPropertyAssignment(node)) {
                        //     // Property name is an identifier but we can't treat it like an expression
                        //     result = f.updatePropertyAssignment(node,
                        //         node.name, ts.visitNode(node.initializer, deepInspectVisitor)
                        //     );
                    } else if (ts.isShorthandPropertyAssignment(node)) {
                        // Convert shorthand ( {x} ) to regular ( {x: x} ) so we can inspect the value
                        result = f.createPropertyAssignment(
                            node.name, ts.visitNode(node.name, deepInspectVisitor(node))
                        );
                        // } else if (ts.isMethodDeclaration(node)) {
                        //     // Method name is an identifier but we can't treat it like an expression
                        //     result = f.updateMethodDeclaration(node,
                        //         node.decorators, node.modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type,
                        //         ts.visitNode(node.body, deepInspectVisitor)
                        //     );
                        // } else if (ts.isSetAccessorDeclaration(node)) {
                        //     // Accessor property name is an identifier but we can't treat it like an expression
                        //     result = f.updateSetAccessorDeclaration(node,
                        //         node.decorators, node.modifiers, node.name, node.parameters,
                        //         ts.visitNode(node.body, deepInspectVisitor)
                        //     );
                        // } else if (ts.isGetAccessorDeclaration(node)) {
                        //     // Accessor property name is an identifier but we can't treat it like an expression
                        //     result = f.updateGetAccessorDeclaration(node,
                        //         node.decorators, node.modifiers, node.name, node.parameters, node.type,
                        //         ts.visitNode(node.body, deepInspectVisitor)
                        //     );
                        // } else if (ts.isFunctionExpression(node)) {
                        //     result = f.updateFunctionExpression(node,
                        //         node.modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type,
                        //         ts.visitNode(node.body, deepInspectVisitor),
                        //     );
                        // } else if (ts.isArrowFunction(node)) {
                        //     result = f.updateArrowFunction(node,
                        //         node.modifiers, node.typeParameters, node.parameters, node.type, node.equalsGreaterThanToken,
                        //         ts.visitNode(node.body, deepInspectVisitor),
                        //     );
                        // } else if (ts.isToken(node) || ts.isLiteralExpression(node)) {
                        //     result = node;
                    } else if (ts.isParenthesizedExpression(node)) {
                        result = f.updateParenthesizedExpression(node,
                            ts.visitNode(node.expression, deepInspectVisitor(node))
                        );
                    } else if (stack.length > 0 && ts.isToken(node) && !ts.isIdentifier(node)) {
                        result = node;
                    } else if (
                        ts.isExpression(node)
                        && !( /*  Identifiers appear in non-expression contexts. */
                            ts.isIdentifier(node) && (
                                ts.isVariableDeclaration(parent) // const IDENT = 123;
                                || ts.isBindingElement(parent) // const [IDENT] = [123];
                                || ts.isPropertyAccessExpression(parent) // something.IDENT;
                                || ts.isFunctionLike(parent) // function IDENT() {}; ({ IDENT() {}, get IDENT() {} });
                                || ts.isParameter(parent) // function(IDENT) {};
                                || ts.isObjectLiteralElementLike(parent) // ({ IDENT: 123 });
                                || ts.isClassElement(parent) // class { IDENT = 123; };
                                || ts.isClassLike(parent) // class IDENT {};
                            ) && parent.name == node
                        )
                        && !( /* Preserve the left-hand side of assignment operators */
                            ts.isBinaryExpression(parent)
                            && parent.operatorToken.kind >= SyntaxKind.FirstAssignment
                            && parent.operatorToken.kind <= SyntaxKind.LastAssignment
                            && parent.left == node
                        )
                    ) {
                        // let original = ts.getOriginalNode(node);
                        const pretty = printer.printNode(ts.EmitHint.Expression, node, sourceFile);
                        const ident = createTempVar(`_${pretty.replace(/\W/g, '_')}`);
                        varDecs.push(f.createVariableDeclaration(ident, undefined, undefined, unevaluatedShorthand));

                        const part = {node, result: undefined! as ts.Node, pretty, ident, children: []};
                        if (stack.length == 0) {
                            if (rootPart != undefined) throw new Error('wtf');
                            rootPart = part;
                        } else {
                            stack[stack.length - 1].children.push(part);
                        }

                        stack.push(part);
                        if (ts.isCallExpression(node)) {
                            if (checkFunctionDeclarationJSDocTagsFromCallExpression(node, tag => inlineTagSet.has(tag.tagName.text)) != null) {
                                // Don't recurse into other @inline calls! It leads to bugs, explosive expansion, and madness!
                                result = node;
                            } else {
                                let funcExpr = node.expression;
                                if (ts.isPropertyAccessExpression(funcExpr)) {
                                    funcExpr = f.updatePropertyAccessExpression(funcExpr,
                                        ts.visitNode(funcExpr.expression, deepInspectVisitor(node)),
                                        funcExpr.name
                                    );
                                } else if (ts.isIdentifier(funcExpr)) {
                                    // required for nested @inline calls
                                } else {
                                    funcExpr = ts.visitNode(funcExpr, deepInspectVisitor(node)); //preserve 'this'
                                }
                                result = f.updateCallExpression(node,
                                    setOriginalNode(funcExpr, node.expression),
                                    node.typeArguments,
                                    ts.visitNodes(node.arguments, deepInspectVisitor(node))
                                );
                            }
                            // } else if (ts.isPropertyAccessExpression(node)) {
                            //     result = f.updatePropertyAccessExpression(node,
                            //         ts.visitNode(node.expression, deepInspectVisitor(node)),
                            //         node.name
                            //     );
                        } else if (ts.isMetaProperty(node)) {
                            result = node;
                        } else if ((ts.isPostfixUnaryExpression(node) || ts.isPrefixUnaryExpression(node)) && (node.operator == SyntaxKind.PlusPlusToken || node.operator == SyntaxKind.MinusMinusToken)) {
                            result = node; // preserve ++ and --
                        } else {
                            result = ts.visitEachChild(node, deepInspectVisitor(node), ctx);
                        }
                        result = f.createParenthesizedExpression(f.createAssignment(ident, result));
                        stack.pop();
                        part.result = result;
                    } else {
                        result = ts.visitEachChild(node, deepInspectVisitor(node), ctx);
                    }
                    return result != node ? setOriginalNode(result, node) : result;
                };
                const ffs = ts.visitNode(callValue, deepInspectVisitor(callNode));
                if (rootPart == undefined) {
                    debugger;
                    let ffffssss = ts.visitNode(callValue, deepInspectVisitor(callNode));
                    throw new Error('wtf' + ffffssss);
                }
                callValue = ffs;
                const paramDetails = {name: paramInfo.sym.name, rootPart};
                callSiteParamDetails.push(paramDetails);
            }

            let initValue = callValue;
            let accessReplace: ts.Expression = replacementIdent;

            const isSimpleValue = ts.isLiteralExpression(initValue);
            if (paramInfo.isLazy && !isSimpleValue) {
                accessReplace = f.createCallExpression(replacementIdent, undefined, undefined);

                initValue = f.createArrowFunction(
                    undefined, undefined, [], undefined, undefined,
                    f.createBlock([
                        f.createVariableStatement([], f.createVariableDeclarationList([
                            f.createVariableDeclaration(
                                f.createIdentifier('v'), undefined, undefined,
                                callValue
                            )
                        ], ts.NodeFlags.Const)),
                        f.createExpressionStatement(f.createAssignment(
                            replacementIdent,
                            f.createArrowFunction(
                                undefined, undefined, [], undefined, undefined,
                                f.createIdentifier('v')
                            )
                        )),
                        f.createReturnStatement(f.createIdentifier('v'))
                    ], true)
                );
            }

            paramAccessReplacements.set(paramInfo, accessReplace);

            varDecs.push(f.createVariableDeclaration(
                replacementIdent, undefined, undefined,
                initValue
            ));
        }

        const bodyVisitor: ts.Visitor = node => {
            if (ts.isIdentifier(node)) {
                if (declInfo.externalSymbolsByInternalIdentifer.has(node)) {
                    if (declInfo.getCallSiteDetailsIdents.has(node)) {

                        const encodeParamPart = (part: ParamPart): ts.ObjectLiteralExpression => f.createObjectLiteralExpression([
                            f.createPropertyAssignment('expression', f.createStringLiteral(part.pretty)),
                            f.createPropertyAssignment('value', part.ident),
                            f.createPropertyAssignment('children', f.createArrayLiteralExpression(part.children.map(encodeParamPart)))
                        ]);

                        return f.createArrowFunction(
                            undefined, undefined, [], undefined, undefined,
                            f.createObjectLiteralExpression([
                                f.createPropertyAssignment('params', f.createArrayLiteralExpression(
                                    callSiteParamDetails.map(pd => f.createObjectLiteralExpression([
                                        f.createPropertyAssignment('name', f.createStringLiteral(pd.name)),
                                        f.createPropertyAssignment('rootPart', encodeParamPart(pd.rootPart))
                                    ]))
                                ))
                            ])
                        );
                    }

                    return setOriginalNode(f.createPropertyAccessExpression(callNode.expression, `upvalue_${node.text}`), node);
                }

                if (declInfo.parameterInfosByIdentifier.has(node)) {
                    const paramInfo = declInfo.parameterInfosByIdentifier.get(node)!;
                    // return setOriginalNode(recreateNodes(paramAccessReplacements.get(paramInfo)!, ctx), node);
                    return paramAccessReplacements.get(paramInfo)!;
                }
            }
            return setOriginalNode(ts.visitEachChild(node, bodyVisitor, ctx), node);
        };

        const body = recreateNodes(f.createBlock([
            ...(varDecs.length > 0 ? [f.createVariableStatement([], f.createVariableDeclarationList(
                varDecs, ts.NodeFlags.Let,
            ))] : []),
            ...decl.body!.statements.map(stmt => ts.visitNode(stmt!, bodyVisitor))
        ], true), ctx);

        if (areWeVisitingParent) {
            // visitNode is ts.ExpressionStatement

            if (mustBeArrowFunc)
                return null; // The call node will be replaced when it is visited.

            const isDeclAsync = decl.modifiers?.some(m => m.kind == ts.SyntaxKind.AsyncKeyword);
            const containingFunction = recurseUntil(visitNode.parent, n => ts.isFunctionDeclaration(n), n => n.parent);
            const isDestinationAsync = containingFunction?.modifiers?.some(m => m.kind == ts.SyntaxKind.AsyncKeyword);
            // todo: handle top-level await

            if (isDeclAsync && !isDestinationAsync) {
                if (mustBeBlock)
                    throw new Error(`ts-inline: cannot inline as block because of async mismatch`);

                return null;
            }

            if (declInfo.hasReturns) {
                if (mustBeBlock)
                    throw new Error(`ts-inline: cannot inline as block because it has a return statement`);

                return null;
            }

            return body;
        }

        // visitNode is ts.CallExpression
        // visitNode === callNode
        if (mustBeBlock)
            throw new Error('ts-inline: cannot inline as block without changing semantics');

        return f.updateCallExpression(callNode,
            f.createArrowFunction(
                decl.modifiers?.filter(m => m.kind == ts.SyntaxKind.AsyncKeyword),
                decl.typeParameters, [], decl.type, undefined,
                body
            ),
            callNode.typeArguments, []
        );
    };

    const visitor: ts.Visitor = node => {
        let result = maybePrepareFunctionDeclarationForInlining(node) ?? maybeInlineCallExpression(node) ?? node;

        if (result instanceof Array)
            return result.map(r => ts.visitEachChild(r, visitor, ctx));

        return ts.visitEachChild(result, visitor, ctx);
    };

    const result = ts.visitNode(sourceFile, visitor);
    // astPrettyPrint(result, sourceFile);
    return result;
};

const recreateNodes = <T extends ts.Node>(root: T, ctx: ts.TransformationContext): T => {
    // // const dedup = new Map<ts.Node, ts.Node>();
    const out = cloneNode(root, {
        preserveSymbols: true,
        setOriginalNodes: true,
        setParents: true,
        factory: {
            ...ctx.factory,
            createTemplateTail: (text: string, rawText?: string, templateFlags?: TokenFlags) => {
                if (text == '\b' && rawText == '\\b') {
                    // !!!?!???!!?!!?!!?!?!!?!?!?!?!?!?!?!?!?!?!?!?!??!!!?!?!!!????!?!?!??!?!???????????!!!?!?!???!?!
                    text = '';
                    rawText = '';
                }
                return ctx.factory.createTemplateTail(text, rawText, templateFlags);
            }
        },
        finalize: (clonedNode, oldNode) => {
            // if (dedup.has(oldNode))
            //     return dedup.get(oldNode) as any;

            ts.setTextRange(clonedNode, undefined);
            // dedup.set(oldNode, clonedNode);
            // return clonedNode as any;

            if (ts.isIdentifier(oldNode)) {
                (clonedNode as any).autoGenerateFlags = (oldNode as any).autoGenerateFlags;
                (clonedNode as any).autoGenerateId = -1 * (oldNode as any).autoGenerateId;
            }
        }
    });
    return out;
    // return root;
};

const forEachChildRecursive = <T>(root: ts.Node, cb: (node: ts.Node) => T | undefined): T | undefined => {
    const visitor = (node: ts.Node): T | undefined => {
        let res = cb(node);
        if (res != undefined)
            return res;
        return ts.forEachChild(node, visitor);
    };
    return ts.forEachChild(root, visitor);
};

const astToString = (node: ts.Node, printer: ts.Printer, sourceFile: ts.SourceFile) => {
    const parts = [ts.SyntaxKind[node.kind]];
    if (ts.isIdentifier(node)) {
        parts.push(printer.printNode(ts.EmitHint.IdentifierName, node, sourceFile));
    } else if (ts.isLiteralExpression(node)) {
        parts.push(printer.printNode(ts.EmitHint.Expression, node, sourceFile));
    }
    return parts;
};

const astPrettyPrint = (root: ts.Node, sourceFile: ts.SourceFile) => {
    const printer = ts.createPrinter({
        //
    });
    const out: string[] = [];
    const recurse = (node: ts.Node, indent: number) => {
        const parts = astToString(node, printer, sourceFile);
        out.push(`${' '.repeat(4 * indent)}${parts.join(' ')}`);
        return ts.forEachChild(node, child => {
            recurse(child, indent + 1);
        });
    };
    recurse(root, 0);
    console.log(out.join('\n'));
};

const astWhereAmI = (root: ts.Node, sourceFile: ts.SourceFile) => {
    const printer = ts.createPrinter({
        //
    });
    const out: string[] = [];
    let curr = root;
    while (curr) {
        const parts = astToString(curr, printer, sourceFile);
        out.unshift(parts.join(' '));
        curr = curr.parent;
    }
    console.log(out.join('\n'));
};

const recurseWhile_Stop = Symbol('recurseWhile_Stop');

function recurseWhile<T, E extends T = T>(start: T, test: (v: T) => boolean, next: (v: T, stop: typeof recurseWhile_Stop) => T | typeof recurseWhile_Stop): E {
    let curr = start;
    while (test(curr)) {
        const newCurr = next(curr, recurseWhile_Stop);
        if (newCurr === recurseWhile_Stop)
            break;
    }
    return curr as E;
}

function recurseUntil<T>(start: T, test: (v: T) => boolean, next: (v: T) => T | undefined): T | undefined {
    let curr: T | undefined = start;
    while (curr !== undefined && !test(curr)) curr = next(curr);
    return curr;
}


function isBlockLike(node: ts.Node): node is ts.BlockLike {
    switch (node.kind) {
        case ts.SyntaxKind.Block:
        case ts.SyntaxKind.SourceFile:
        case ts.SyntaxKind.ModuleBlock:
        case ts.SyntaxKind.CaseClause:
            return true;
        default:
            return false;
    }
}

interface MapLike<K, V> {
    get(key: K): V | undefined;

    has(key: K): boolean;

    set(key: K, value: V): this;
}

export function getOrPut<K, V, M extends V>(map: MapLike<K, V>, key: K, make: () => M): V {
    if (map.has(key))
        return map.get(key)!;

    const val = make();
    map.set(key, val);
    return val;
}


export default makeTransformerFactory;


