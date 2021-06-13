/** @inline-special-getCallSiteDetails */
export declare function getCallSiteDetails(): CallSiteDetails | undefined;
export declare namespace getCallSiteDetails {
    var UNEVALUATED: symbol;
}
export interface ParamPart {
    expression: string;
    value: any | typeof getCallSiteDetails.UNEVALUATED;
    children: ParamPart[];
}
export interface ParamDetails {
    name: string;
    rootPart: ParamPart;
}
export interface CallSiteDetails {
    params: ParamDetails[];
}
