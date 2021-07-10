import {Transformer} from 'ts-transformer-testing-library';
import * as ts from 'typescript';
import makeTransformerFactory from "./transformer";
import * as fs from 'fs';

const transformer = new Transformer()
        .setCompilerOptions({
            target: ts.ScriptTarget.ESNext,//ES5,
            // module: ts.ModuleKind.CommonJS,
        })
        .addTransformer(makeTransformerFactory)
        .setFilePath('./index.ts')
    // .addMock({
    //     name: 'assert',
    //     content: `
    //         /** @inline */
    //         export function assert (v: unknown, msg?: string): asserts v {
    //             if(!v) throw new Error(\`Assertion failed \${msg ?? v}\`);
    //         };
    //     `,
    // })
;


it("should transform normal assert call into inspecto patronum assert call", () => {
    const out = transformer.transform(`
        // import { assert } from 'assert';
        // @ts-ignore
        const inspect = require('browser-util-inspect');
        
        let testUpvalue = 0;
        
        function shouldNotBeCalled(): string {
            throw new Error('shouldNotBeCalled');
        }
        
        /*********************/
        /*********************/
                
        /** @inline-special-getCallSiteDetails */
        function getCallSiteDetails(): CallSiteDetails | undefined {
            return undefined;
        }

        getCallSiteDetails.UNEVALUATED = Symbol('getCallSiteDetails.UNEVALUATED');
        
        interface ParamPart {
            expression: string;
            value: any | typeof getCallSiteDetails.UNEVALUATED;
            children: ParamPart[];
        }
        
        interface ParamDetails {
            name: string;
            rootPart: ParamPart;
        }
        
        interface CallSiteDetails {
            params: ParamDetails[];
        }
        
        /*********************/
        /*********************/
        
        class AssertionFailedError extends Error {
            constructor(val: unknown, msg: string | undefined, pd?: ParamDetails | undefined) {
                let msgParts = [];//['Assertion failed: '];
                if(msg !== undefined)
                    msgParts.push(msg);
                
                if(pd) {
                    if(msg === undefined)
                        msgParts.push(pd.rootPart.expression);
                    
                    const maxArgStrColWidth = 40;
                    const recurse = (part: ParamPart) => {
                        for(const subPart of part.children) recurse(subPart);
                        
                        msgParts.push('\\n');
                        if(part.expression.length < maxArgStrColWidth)
                            msgParts.push(' '.repeat(maxArgStrColWidth - part.expression.length));
                        msgParts.push(part.expression);
                        msgParts.push('    ');
                        if(part.value === getCallSiteDetails.UNEVALUATED) {
                            msgParts.push('unevaluated');
                        } else {
                            msgParts.push(inspect(part.value));
                        }
                    }
                    recurse(pd.rootPart);
                }
                super(msgParts.join(''));
            }
        }
        
        /** @inline */
        function assert( /** @inspectable */ v: unknown, /** @lazy */ msg?: string): asserts v {
            testUpvalue++;
            if(!v) throw new AssertionFailedError(v, msg, getCallSiteDetails()?.params[0]);
        }
        
        /** @inline */
        function onlyDefined<T>( /** @inspectable */ v: T, /** @lazy */ msg?: string): NonNullable<T> {
            testUpvalue++;
            if(v === undefined || v === null)
                throw new AssertionFailedError(v, msg, getCallSiteDetails()?.params[0]);
            return v as NonNullable<T>;
        }
        
        /*********************/
        /*********************/

        {
            let testUpvalue = 0;
            assert(true, shouldNotBeCalled());
            onlyDefined(false);
            assert(testUpvalue == 0);

            let x = 0;
            assert(true, String(x++));
            assert(x == 0);
        }
        assert(testUpvalue == 5);

        /*********************/
        /*********************/

        try {
            const two = 2;
            const three = 3;
            let fourFiveSix = 4;
            let accessedFromFunction = 9;
            const callThrice = (f: () => number) => { f(); f(); return f(); }
            assert(two + 1 + fourFiveSix++ + callThrice(() => ++accessedFromFunction) == fourFiveSix + 2 * three - parseFloat('1.5' + 'e2') + ++fourFiveSix && fourFiveSix + 1 == 999, \`oh \${'no'}!\`);
        } catch(e) {
            console.log(e);
        }

        /*********************/
        /*********************/

        const o = { files: [ "blah" ] };
        assert(o.files.length == 1);

        const input = {
            process: {
                fileName: "hmm",
            },
        };

        assert(true, \`Could not parse file name: \${input.process.fileName}\`);

        /*********************/
        /*********************/

        const x = 2, y = 2, z = 3;
        const tests = [
            function ConditionalExpression() { assert(x ? y : z); },
            function* YieldExpression(): Generator<number> { assert(yield x); },
            function ArrowFunction() { assert((() => x)() == (() => y)()); },
            function BinaryExpression() { assert(x == y); },
            function SpreadElement() { assert({...{x}}.x == {...{y}}.y); },
            // function AsExpression() {},
            // function OmittedExpression() {},
            function CommaListExpression() { assert((String(z), x) == (String(z+1), y)); },
            // function PartiallyEmittedExpression() {},
            function PrefixUnaryExpression() { assert(~x == ~y); },
            function PostfixUnaryExpression() { let a = 5; assert(a++ == a-- - 1); },
            function DeleteExpression() { assert(delete ({x} as {x?: number}).x); },
            function TypeOfExpression() { assert(typeof x == typeof y); },
            function VoidExpression() { assert(void x == void 0); },
            async function AwaitExpression() { assert(x == await new Promise(r => r(y))); },
            // function TypeAssertionExpression() {},
            function PropertyAccessExpression() { assert(({x}).x == ({a: y}).a); },
            function ElementAccessExpression() { assert(({['x']: x}).x == ({[y]: y})[y]); },
            function NewExpression() { assert(new Error(String(x)).message == new Error(String(y)).message); },
            function CallExpression() { assert(String(x) == String(y)); },
            // function JsxElement() {},
            // function JsxSelfClosingElement() {},
            // function JsxFragment() {},
            // function TaggedTemplateExpression() {
            //     function tag<T extends readonly string[], S extends readonly unknown[]>(template: T, ...subs: S) {
            //         return {template, subs};
            //     }
            //     assert(tag\`test\${x}test\`.subs[0] == y);
            // },
            function ArrayLiteralExpression() { assert([x,y,z][x] == z); },
            function ParenthesizedExpression() { assert(((((((x)))))) + 2 == (y+((2)))); },
            function ObjectLiteralExpression() { assert(({x:x,y,['z']: z,b() { return x},get a() { return x; }}).a == x); },
            function ClassExpression() { assert((new class { q = 5; constructor(public a = x){}}).a == x); },
            function FunctionExpression() { assert((function (q: number) { return x+q; })(2) == x+2); },
            function Identifier() { assert(x); },
            function RegularExpressionLiteral() { assert(x.toString().match(/^2$/)); },
            function NumericLiteral() { assert(x + 2 == x - 1 + 3); },
            function BigIntLiteral() { assert(123456789n > 2n + BigInt(x)); },
            function StringLiteral() { assert('test' + x == "test" + y); },
            function NoSubstitutionTemplateLiteral() { assert(\`test\` + x == \`test\` + y); },
            function TemplateExpression() { assert(\`\${x}test\` == \`\${y}test\`); },
            function FalseKeyword() { assert(false == !true); },
            function NullKeyword() { assert(null != {}); },
            function ThisKeyword(this: any) { assert(this === this); },
            function SuperKeyword() { new class extends Error { constructor() { super('test'); assert(super.message == super.message); } } },
            // function NonNullExpression() {},
            function MetaProperty() { function metaProperty() { assert(new.target); } },
            // function ImportKeyword() { try{ assert(import('fail')) } catch(e) {}; }
           
            // special
            function AssignmentOperator() { let a, b, c, o = {d:0}; assert(a = b = c = o.d = 4); },
            function Nested() { assert(onlyDefined(onlyDefined(onlyDefined(onlyDefined(x == y))))); }
        ]
        for (const test of tests) {
            test();
        }
        
        
        /*********************/
        /*********************/
        // assert(fs.appendFileSync);
    `);
    // console.log(out);
    fs.writeFileSync('output.js', out);
    eval(out);
    expect(out);
});
