import * as ts from 'typescript';
declare module 'typescript' {
    function isExpression(node: ts.Node): node is ts.Expression;
}
interface TransformerConfig {
    jsDocTagNames: {
        inline: string;
        inlineAsBlock: string;
        inlineAsImmediatelyInvokedArrowFunction: string;
        lazy: string;
        inspectable: string;
        specialGetCallSiteDetails: string;
    };
}
declare const makeTransformerFactory: (program: ts.Program, optsIn?: TransformerConfig | undefined) => (ctx: ts.TransformationContext) => (sourceFile: ts.SourceFile) => ts.SourceFile;
interface MapLike<K, V> {
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
}
export declare function getOrPut<K, V, M extends V>(map: MapLike<K, V>, key: K, make: () => M): V;
export default makeTransformerFactory;
