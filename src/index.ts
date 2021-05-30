//

/** @inline-special-getCallSiteDetails */
export function getCallSiteDetails(): CallSiteDetails | undefined {
    return undefined;
}

getCallSiteDetails.UNEVALUATED = Symbol('getCallSiteDetails.UNEVALUATED');


export interface ParamPart {
    expression: string;
    value: any | typeof getCallSiteDetails.UNEVALUATED;
    subs: ParamPart[];
}

export interface ParamDetails {
    name: string;
    parts: ParamPart[];
}

export interface CallSiteDetails {
    params: ParamDetails[];
}


