// import { assert } from 'assert';
// @ts-ignore
const inspect = require('browser-util-inspect');
let testUpvalue = 0;

function shouldNotBeCalled() {
    throw new Error('shouldNotBeCalled');
}

/*********************/

/*********************/
/** @inline-special-getCallSiteDetails */
function getCallSiteDetails() {
    return undefined;
}

getCallSiteDetails.UNEVALUATED = Symbol('getCallSiteDetails.UNEVALUATED');
/*********************/

/*********************/
class AssertionFailedError extends Error {
    constructor(val, msg, pd) {
        let msgParts = []; //['Assertion failed: '];
        if (msg !== undefined)
            msgParts.push(msg);
        if (pd) {
            if (msg === undefined)
                msgParts.push(pd.rootPart.expression);
            const maxArgStrColWidth = 40;
            const recurse = (part) => {
                for (const subPart of part.children)
                    recurse(subPart);
                msgParts.push('\n');
                if (part.expression.length < maxArgStrColWidth)
                    msgParts.push(' '.repeat(maxArgStrColWidth - part.expression.length));
                msgParts.push(part.expression);
                msgParts.push('    ');
                if (part.value === getCallSiteDetails.UNEVALUATED) {
                    msgParts.push('unevaluated');
                } else {
                    msgParts.push(inspect(part.value));
                }
            };
            recurse(pd.rootPart);
        }
        super(msgParts.join(''));
    }
}

/** @inline */
function assert(/** @inspectable */ v, /** @lazy */ msg) {
    testUpvalue++;
    if (!v)
        throw new AssertionFailedError(v, msg, getCallSiteDetails()?.params[0]);
}

Object.defineProperty(assert, 'upvalue_testUpvalue', {
    get() {
        return testUpvalue;
    }, set(v) {
        testUpvalue = v;
    }
})
Object.defineProperty(assert, 'upvalue_AssertionFailedError', {
    get() {
        return AssertionFailedError;
    }, set(v) {
        AssertionFailedError = v;
    }
})
Object.defineProperty(assert, 'upvalue_getCallSiteDetails', {
    get() {
        return getCallSiteDetails;
    }, set(v) {
        getCallSiteDetails = v;
    }
})

/** @inline */
function onlyDefined(/** @inspectable */ v, /** @lazy */ msg) {
    testUpvalue++;
    if (v === undefined || v === null)
        throw new AssertionFailedError(v, msg, getCallSiteDetails()?.params[0]);
    return v;
}

Object.defineProperty(onlyDefined, 'upvalue_testUpvalue', {
    get() {
        return testUpvalue;
    }, set(v) {
        testUpvalue = v;
    }
})
Object.defineProperty(onlyDefined, 'upvalue_AssertionFailedError', {
    get() {
        return AssertionFailedError;
    }, set(v) {
        AssertionFailedError = v;
    }
})
Object.defineProperty(onlyDefined, 'upvalue_getCallSiteDetails', {
    get() {
        return getCallSiteDetails;
    }, set(v) {
        getCallSiteDetails = v;
    }
})
/*********************/
/*********************/
{
    let testUpvalue = 0;
    {
        let U = assert.upvalue_getCallSiteDetails.UNEVALUATED, _true = U, v_1 = (_true = true), msg_1 = () => {
            const v = shouldNotBeCalled();
            msg_1 = () => v;
            return v;
        };
        assert.upvalue_testUpvalue++;
        if (!v_1)
            throw new assert.upvalue_AssertionFailedError(v_1, msg_1(), (() => ({
                params: [{
                    name: "v",
                    rootPart: {expression: "true", value: _true, children: []}
                }]
            }))()?.params[0]);
    }
    (() => {
        let U_8 = onlyDefined.upvalue_getCallSiteDetails.UNEVALUATED, _false = U_8, v_9 = (_false = false),
            msg_9 = () => {
                const v = void 0;
                msg_9 = () => v;
                return v;
            };
        onlyDefined.upvalue_testUpvalue++;
        if (v_9 === undefined || v_9 === null)
            throw new onlyDefined.upvalue_AssertionFailedError(v_9, msg_9(), (() => ({
                params: [{
                    name: "v",
                    rootPart: {expression: "false", value: _false, children: []}
                }]
            }))()?.params[0]);
        return v_9;
    })();
    {
        let U_1 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _testUpvalue____0 = U_1, _testUpvalue = U_1,
            v_2 = (_testUpvalue____0 = (_testUpvalue = testUpvalue) == 0), msg_2 = () => {
                const v = void 0;
                msg_2 = () => v;
                return v;
            };
        assert.upvalue_testUpvalue++;
        if (!v_2)
            throw new assert.upvalue_AssertionFailedError(v_2, msg_2(), (() => ({
                params: [{
                    name: "v",
                    rootPart: {
                        expression: "testUpvalue == 0",
                        value: _testUpvalue____0,
                        children: [{expression: "testUpvalue", value: _testUpvalue, children: []}]
                    }
                }]
            }))()?.params[0]);
    }
    let x = 0;
    {
        let U_2 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _true_1 = U_2, v_3 = (_true_1 = true), msg_3 = () => {
            const v = String(x++);
            msg_3 = () => v;
            return v;
        };
        assert.upvalue_testUpvalue++;
        if (!v_3)
            throw new assert.upvalue_AssertionFailedError(v_3, msg_3(), (() => ({
                params: [{
                    name: "v",
                    rootPart: {expression: "true", value: _true_1, children: []}
                }]
            }))()?.params[0]);
    }
    {
        let U_3 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x____0 = U_3, _x = U_3,
            v_4 = (_x____0 = (_x = x) == 0), msg_4 = () => {
                const v = void 0;
                msg_4 = () => v;
                return v;
            };
        assert.upvalue_testUpvalue++;
        if (!v_4)
            throw new assert.upvalue_AssertionFailedError(v_4, msg_4(), (() => ({
                params: [{
                    name: "v",
                    rootPart: {
                        expression: "x == 0",
                        value: _x____0,
                        children: [{expression: "x", value: _x, children: []}]
                    }
                }]
            }))()?.params[0]);
    }
}
{
    let U_4 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _testUpvalue____5 = U_4, _testUpvalue_1 = U_4,
        v_5 = (_testUpvalue____5 = (_testUpvalue_1 = testUpvalue) == 5), msg_5 = () => {
            const v = void 0;
            msg_5 = () => v;
            return v;
        };
    assert.upvalue_testUpvalue++;
    if (!v_5)
        throw new assert.upvalue_AssertionFailedError(v_5, msg_5(), (() => ({
            params: [{
                name: "v",
                rootPart: {
                    expression: "testUpvalue == 5",
                    value: _testUpvalue____5,
                    children: [{expression: "testUpvalue", value: _testUpvalue_1, children: []}]
                }
            }]
        }))()?.params[0]);
}
/*********************/
/*********************/
try {
    const two = 2;
    const three = 3;
    let fourFiveSix = 4;
    let accessedFromFunction = 9;
    const callThrice = (f) => {
        f();
        f();
        return f();
    };
    {
        let U_5 = assert.upvalue_getCallSiteDetails.UNEVALUATED,
            _two___1___fourFiveSix_____callThrice_________accessedFromFunction_____fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix____fourFiveSix___1____999 = U_5,
            _two___1___fourFiveSix_____callThrice_________accessedFromFunction_____fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix = U_5,
            _two___1___fourFiveSix_____callThrice_________accessedFromFunction_ = U_5, _two___1___fourFiveSix__ = U_5,
            _two___1 = U_5, _two = U_5, _fourFiveSix__ = U_5, _callThrice_________accessedFromFunction_ = U_5,
            _________accessedFromFunction = U_5, ___accessedFromFunction = U_5,
            _fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix = U_5,
            _fourFiveSix___2___three___parseFloat__1_5_____e2__ = U_5, _fourFiveSix___2___three = U_5,
            _fourFiveSix = U_5, _2___three = U_5, _three = U_5, _parseFloat__1_5_____e2__ = U_5, __1_5_____e2_ = U_5,
            ___fourFiveSix = U_5, _fourFiveSix___1____999 = U_5, _fourFiveSix___1 = U_5, _fourFiveSix_1 = U_5,
            v_6 = (_two___1___fourFiveSix_____callThrice_________accessedFromFunction_____fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix____fourFiveSix___1____999 = (_two___1___fourFiveSix_____callThrice_________accessedFromFunction_____fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix = (_two___1___fourFiveSix_____callThrice_________accessedFromFunction_ = (_two___1___fourFiveSix__ = (_two___1 = (_two = two) + 1) + (_fourFiveSix__ = fourFiveSix++)) + (_callThrice_________accessedFromFunction_ = callThrice((_________accessedFromFunction = () => (___accessedFromFunction = ++accessedFromFunction))))) == (_fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix = (_fourFiveSix___2___three___parseFloat__1_5_____e2__ = (_fourFiveSix___2___three = (_fourFiveSix = fourFiveSix) + (_2___three = 2 * (_three = three))) - (_parseFloat__1_5_____e2__ = parseFloat((__1_5_____e2_ = "1.5" + "e2")))) + (___fourFiveSix = ++fourFiveSix))) && (_fourFiveSix___1____999 = (_fourFiveSix___1 = (_fourFiveSix_1 = fourFiveSix) + 1) == 999)),
            msg_6 = () => {
                const v = `oh ${"no"}!`;
                msg_6 = () => v;
                return v;
            };
        assert.upvalue_testUpvalue++;
        if (!v_6)
            throw new assert.upvalue_AssertionFailedError(v_6, msg_6(), (() => ({
                params: [{
                    name: "v", rootPart: {
                        expression: "two + 1 + fourFiveSix++ + callThrice(() => ++accessedFromFunction) == fourFiveSix + 2 * three - parseFloat('1.5' + 'e2') + ++fourFiveSix && fourFiveSix + 1 == 999",
                        value: _two___1___fourFiveSix_____callThrice_________accessedFromFunction_____fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix____fourFiveSix___1____999,
                        children: [{
                            expression: "two + 1 + fourFiveSix++ + callThrice(() => ++accessedFromFunction) == fourFiveSix + 2 * three - parseFloat('1.5' + 'e2') + ++fourFiveSix",
                            value: _two___1___fourFiveSix_____callThrice_________accessedFromFunction_____fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix,
                            children: [{
                                expression: "two + 1 + fourFiveSix++ + callThrice(() => ++accessedFromFunction)",
                                value: _two___1___fourFiveSix_____callThrice_________accessedFromFunction_,
                                children: [{
                                    expression: "two + 1 + fourFiveSix++",
                                    value: _two___1___fourFiveSix__,
                                    children: [{
                                        expression: "two + 1",
                                        value: _two___1,
                                        children: [{expression: "two", value: _two, children: []}]
                                    }, {expression: "fourFiveSix++", value: _fourFiveSix__, children: []}]
                                }, {
                                    expression: "callThrice(() => ++accessedFromFunction)",
                                    value: _callThrice_________accessedFromFunction_,
                                    children: [{
                                        expression: "() => ++accessedFromFunction",
                                        value: _________accessedFromFunction,
                                        children: [{
                                            expression: "++accessedFromFunction",
                                            value: ___accessedFromFunction,
                                            children: []
                                        }]
                                    }]
                                }]
                            }, {
                                expression: "fourFiveSix + 2 * three - parseFloat('1.5' + 'e2') + ++fourFiveSix",
                                value: _fourFiveSix___2___three___parseFloat__1_5_____e2_______fourFiveSix,
                                children: [{
                                    expression: "fourFiveSix + 2 * three - parseFloat('1.5' + 'e2')",
                                    value: _fourFiveSix___2___three___parseFloat__1_5_____e2__,
                                    children: [{
                                        expression: "fourFiveSix + 2 * three",
                                        value: _fourFiveSix___2___three,
                                        children: [{
                                            expression: "fourFiveSix",
                                            value: _fourFiveSix,
                                            children: []
                                        }, {
                                            expression: "2 * three",
                                            value: _2___three,
                                            children: [{expression: "three", value: _three, children: []}]
                                        }]
                                    }, {
                                        expression: "parseFloat('1.5' + 'e2')",
                                        value: _parseFloat__1_5_____e2__,
                                        children: [{expression: "'1.5' + 'e2'", value: __1_5_____e2_, children: []}]
                                    }]
                                }, {expression: "++fourFiveSix", value: ___fourFiveSix, children: []}]
                            }]
                        }, {
                            expression: "fourFiveSix + 1 == 999",
                            value: _fourFiveSix___1____999,
                            children: [{
                                expression: "fourFiveSix + 1",
                                value: _fourFiveSix___1,
                                children: [{expression: "fourFiveSix", value: _fourFiveSix_1, children: []}]
                            }]
                        }]
                    }
                }]
            }))()?.params[0]);
    }
} catch (e) {
    console.log(e);
}
/*********************/
/*********************/
const o = {files: ["blah"]};
{
    let U_6 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _o_files_length____1 = U_6, _o_files_length = U_6,
        _o_files = U_6, _o = U_6,
        v_7 = (_o_files_length____1 = (_o_files_length = (_o_files = (_o = o).files).length) == 1), msg_7 = () => {
            const v = void 0;
            msg_7 = () => v;
            return v;
        };
    assert.upvalue_testUpvalue++;
    if (!v_7)
        throw new assert.upvalue_AssertionFailedError(v_7, msg_7(), (() => ({
            params: [{
                name: "v",
                rootPart: {
                    expression: "o.files.length == 1",
                    value: _o_files_length____1,
                    children: [{
                        expression: "o.files.length",
                        value: _o_files_length,
                        children: [{
                            expression: "o.files",
                            value: _o_files,
                            children: [{expression: "o", value: _o, children: []}]
                        }]
                    }]
                }
            }]
        }))()?.params[0]);
}
const input = {
    process: {
        fileName: "hmm",
    },
};
{
    let U_7 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _true_2 = U_7, v_8 = (_true_2 = true), msg_8 = () => {
        const v = `Could not parse file name: ${input.process.fileName}`;
        msg_8 = () => v;
        return v;
    };
    assert.upvalue_testUpvalue++;
    if (!v_8)
        throw new assert.upvalue_AssertionFailedError(v_8, msg_8(), (() => ({
            params: [{
                name: "v",
                rootPart: {expression: "true", value: _true_2, children: []}
            }]
        }))()?.params[0]);
}
/*********************/
/*********************/
const x = 2, y = 2, z = 3;
const tests = [
    function ConditionalExpression() {
        {
            let U_9 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x___y___z = U_9, _x_1 = U_9, _y = U_9, _z = U_9,
                v_10 = (_x___y___z = (_x_1 = x) ? (_y = y) : (_z = z)), msg_10 = () => {
                    const v = void 0;
                    msg_10 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_10)
                throw new assert.upvalue_AssertionFailedError(v_10, msg_10(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "x ? y : z",
                            value: _x___y___z,
                            children: [{expression: "x", value: _x_1, children: []}, {
                                expression: "y",
                                value: _y,
                                children: []
                            }, {expression: "z", value: _z, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function* YieldExpression() {
        {
            let U_10 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _yield_x = U_10, _x_2 = U_10,
                v_11 = (_yield_x = yield (_x_2 = x)), msg_11 = () => {
                    const v = void 0;
                    msg_11 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_11)
                throw new assert.upvalue_AssertionFailedError(v_11, msg_11(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "yield x",
                            value: _yield_x,
                            children: [{expression: "x", value: _x_2, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function ArrowFunction() {
        {
            let U_11 = assert.upvalue_getCallSiteDetails.UNEVALUATED, ________x______________y___ = U_11,
                ________x___ = U_11, _______x = U_11, _x_3 = U_11, ________y___ = U_11, _______y = U_11, _y_1 = U_11,
                v_12 = (________x______________y___ = (________x___ = ((_______x = () => (_x_3 = x)))()) == (________y___ = ((_______y = () => (_y_1 = y)))())),
                msg_12 = () => {
                    const v = void 0;
                    msg_12 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_12)
                throw new assert.upvalue_AssertionFailedError(v_12, msg_12(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "(() => x)() == (() => y)()",
                            value: ________x______________y___,
                            children: [{
                                expression: "(() => x)()",
                                value: ________x___,
                                children: [{
                                    expression: "() => x",
                                    value: _______x,
                                    children: [{expression: "x", value: _x_3, children: []}]
                                }]
                            }, {
                                expression: "(() => y)()",
                                value: ________y___,
                                children: [{
                                    expression: "() => y",
                                    value: _______y,
                                    children: [{expression: "y", value: _y_1, children: []}]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function BinaryExpression() {
        {
            let U_12 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x____y = U_12, _x_4 = U_12, _y_2 = U_12,
                v_13 = (_x____y = (_x_4 = x) == (_y_2 = y)), msg_13 = () => {
                    const v = void 0;
                    msg_13 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_13)
                throw new assert.upvalue_AssertionFailedError(v_13, msg_13(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "x == y",
                            value: _x____y,
                            children: [{expression: "x", value: _x_4, children: []}, {
                                expression: "y",
                                value: _y_2,
                                children: []
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function SpreadElement() {
        {
            let U_13 = assert.upvalue_getCallSiteDetails.UNEVALUATED, ________x_____x___________y_____y = U_13,
                ________x_____x = U_13, ________x____ = U_13, ___x__ = U_13, ________y_____y = U_13,
                ________y____ = U_13, ___y__ = U_13,
                v_14 = (________x_____x___________y_____y = (________x_____x = (________x____ = {...(___x__ = {x: x})}).x) == (________y_____y = (________y____ = {...(___y__ = {y: y})}).y)),
                msg_14 = () => {
                    const v = void 0;
                    msg_14 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_14)
                throw new assert.upvalue_AssertionFailedError(v_14, msg_14(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "{ ...{ x } }.x == { ...{ y } }.y",
                            value: ________x_____x___________y_____y,
                            children: [{
                                expression: "{ ...{ x } }.x",
                                value: ________x_____x,
                                children: [{
                                    expression: "{ ...{ x } }",
                                    value: ________x____,
                                    children: [{expression: "{ x }", value: ___x__, children: []}]
                                }]
                            }, {
                                expression: "{ ...{ y } }.y",
                                value: ________y_____y,
                                children: [{
                                    expression: "{ ...{ y } }",
                                    value: ________y____,
                                    children: [{expression: "{ y }", value: ___y__, children: []}]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    // function AsExpression() {},
    // function OmittedExpression() {},
    function CommaListExpression() {
        {
            let U_14 = assert.upvalue_getCallSiteDetails.UNEVALUATED, __String_z___x______String_z___1___y_ = U_14,
                _String_z___x = U_14, _String_z_ = U_14, _z_1 = U_14, _x_5 = U_14, _String_z___1___y = U_14,
                _String_z___1_ = U_14, _z___1 = U_14, _z_2 = U_14, _y_3 = U_14,
                v_15 = (__String_z___x______String_z___1___y_ = ((_String_z___x = ((_String_z_ = String((_z_1 = z))), (_x_5 = x)))) == ((_String_z___1___y = ((_String_z___1_ = String((_z___1 = (_z_2 = z) + 1))), (_y_3 = y))))),
                msg_15 = () => {
                    const v = void 0;
                    msg_15 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_15)
                throw new assert.upvalue_AssertionFailedError(v_15, msg_15(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "(String(z), x) == (String(z + 1), y)",
                            value: __String_z___x______String_z___1___y_,
                            children: [{
                                expression: "String(z), x",
                                value: _String_z___x,
                                children: [{
                                    expression: "String(z)",
                                    value: _String_z_,
                                    children: [{expression: "z", value: _z_1, children: []}]
                                }, {expression: "x", value: _x_5, children: []}]
                            }, {
                                expression: "String(z + 1), y",
                                value: _String_z___1___y,
                                children: [{
                                    expression: "String(z + 1)",
                                    value: _String_z___1_,
                                    children: [{
                                        expression: "z + 1",
                                        value: _z___1,
                                        children: [{expression: "z", value: _z_2, children: []}]
                                    }]
                                }, {expression: "y", value: _y_3, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    // function PartiallyEmittedExpression() {},
    function PrefixUnaryExpression() {
        {
            let U_15 = assert.upvalue_getCallSiteDetails.UNEVALUATED, __x_____y = U_15, __x = U_15, _x_6 = U_15,
                __y = U_15, _y_4 = U_15, v_16 = (__x_____y = (__x = ~(_x_6 = x)) == (__y = ~(_y_4 = y))),
                msg_16 = () => {
                    const v = void 0;
                    msg_16 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_16)
                throw new assert.upvalue_AssertionFailedError(v_16, msg_16(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "~x == ~y",
                            value: __x_____y,
                            children: [{
                                expression: "~x",
                                value: __x,
                                children: [{expression: "x", value: _x_6, children: []}]
                            }, {expression: "~y", value: __y, children: [{expression: "y", value: _y_4, children: []}]}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function PostfixUnaryExpression() {
        let a = 5;
        {
            let U_16 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _a______a_____1 = U_16, _a__ = U_16,
                _a_____1 = U_16, _a__1 = U_16,
                v_17 = (_a______a_____1 = (_a__ = a++) == (_a_____1 = (_a__1 = a--) - 1)), msg_17 = () => {
                    const v = void 0;
                    msg_17 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_17)
                throw new assert.upvalue_AssertionFailedError(v_17, msg_17(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "a++ == a-- - 1",
                            value: _a______a_____1,
                            children: [{expression: "a++", value: _a__, children: []}, {
                                expression: "a-- - 1",
                                value: _a_____1,
                                children: [{expression: "a--", value: _a__1, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function DeleteExpression() {
        {
            let U_17 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _delete____x___as________x___number______x = U_17,
                ____x___as________x___number______x = U_17, ___x___as________x___number____ = U_17, ___x__1 = U_17,
                v_18 = (_delete____x___as________x___number______x = delete (____x___as________x___number______x = ((___x___as________x___number____ = (___x__1 = {x: x}))).x)),
                msg_18 = () => {
                    const v = void 0;
                    msg_18 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_18)
                throw new assert.upvalue_AssertionFailedError(v_18, msg_18(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "delete ({ x } as {\r\n    x?: number;\r\n}).x",
                            value: _delete____x___as________x___number______x,
                            children: [{
                                expression: "({ x } as {\r\n    x?: number;\r\n}).x",
                                value: ____x___as________x___number______x,
                                children: [{
                                    expression: "{ x } as {\r\n    x?: number;\r\n}",
                                    value: ___x___as________x___number____,
                                    children: [{expression: "{ x }", value: ___x__1, children: []}]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function TypeOfExpression() {
        {
            let U_18 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _typeof_x____typeof_y = U_18, _typeof_x = U_18,
                _x_7 = U_18, _typeof_y = U_18, _y_5 = U_18,
                v_19 = (_typeof_x____typeof_y = (_typeof_x = typeof (_x_7 = x)) == (_typeof_y = typeof (_y_5 = y))),
                msg_19 = () => {
                    const v = void 0;
                    msg_19 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_19)
                throw new assert.upvalue_AssertionFailedError(v_19, msg_19(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "typeof x == typeof y",
                            value: _typeof_x____typeof_y,
                            children: [{
                                expression: "typeof x",
                                value: _typeof_x,
                                children: [{expression: "x", value: _x_7, children: []}]
                            }, {
                                expression: "typeof y",
                                value: _typeof_y,
                                children: [{expression: "y", value: _y_5, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function VoidExpression() {
        {
            let U_19 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _void_x____void_0 = U_19, _void_x = U_19,
                _x_8 = U_19, _void_0 = U_19,
                v_20 = (_void_x____void_0 = (_void_x = void (_x_8 = x)) == (_void_0 = void 0)), msg_20 = () => {
                    const v = void 0;
                    msg_20 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_20)
                throw new assert.upvalue_AssertionFailedError(v_20, msg_20(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "void x == void 0",
                            value: _void_x____void_0,
                            children: [{
                                expression: "void x",
                                value: _void_x,
                                children: [{expression: "x", value: _x_8, children: []}]
                            }, {expression: "void 0", value: _void_0, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    async function AwaitExpression() {
        {
            let U_20 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x____await_new_Promise_r____r_y__ = U_20,
                _x_9 = U_20, _await_new_Promise_r____r_y__ = U_20, _new_Promise_r____r_y__ = U_20, _Promise = U_20,
                _r____r_y_ = U_20, _r_y_ = U_20, _y_6 = U_20,
                v_21 = (_x____await_new_Promise_r____r_y__ = (_x_9 = x) == (_await_new_Promise_r____r_y__ = await (_new_Promise_r____r_y__ = new (_Promise = Promise)((_r____r_y_ = r => (_r_y_ = r((_y_6 = y)))))))),
                msg_21 = () => {
                    const v = void 0;
                    msg_21 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_21)
                throw new assert.upvalue_AssertionFailedError(v_21, msg_21(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "x == await new Promise(r => r(y))",
                            value: _x____await_new_Promise_r____r_y__,
                            children: [{
                                expression: "x",
                                value: _x_9,
                                children: []
                            }, {
                                expression: "await new Promise(r => r(y))",
                                value: _await_new_Promise_r____r_y__,
                                children: [{
                                    expression: "new Promise(r => r(y))",
                                    value: _new_Promise_r____r_y__,
                                    children: [{
                                        expression: "Promise",
                                        value: _Promise,
                                        children: []
                                    }, {
                                        expression: "r => r(y)",
                                        value: _r____r_y_,
                                        children: [{
                                            expression: "r(y)",
                                            value: _r_y_,
                                            children: [{expression: "y", value: _y_6, children: []}]
                                        }]
                                    }]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    // function TypeAssertionExpression() {},
    function PropertyAccessExpression() {
        {
            let U_21 = assert.upvalue_getCallSiteDetails.UNEVALUATED, ____x____x_______a__y____a = U_21,
                ____x____x = U_21, ___x__2 = U_21, ____a__y____a = U_21, ___a__y__ = U_21, _y_7 = U_21,
                v_22 = (____x____x_______a__y____a = (____x____x = ((___x__2 = {x: x})).x) == (____a__y____a = ((___a__y__ = {a: (_y_7 = y)})).a)),
                msg_22 = () => {
                    const v = void 0;
                    msg_22 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_22)
                throw new assert.upvalue_AssertionFailedError(v_22, msg_22(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "({ x }).x == ({ a: y }).a",
                            value: ____x____x_______a__y____a,
                            children: [{
                                expression: "({ x }).x",
                                value: ____x____x,
                                children: [{expression: "{ x }", value: ___x__2, children: []}]
                            }, {
                                expression: "({ a: y }).a",
                                value: ____a__y____a,
                                children: [{
                                    expression: "{ a: y }",
                                    value: ___a__y__,
                                    children: [{expression: "y", value: _y_7, children: []}]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function ElementAccessExpression() {
        {
            let U_22 = assert.upvalue_getCallSiteDetails.UNEVALUATED, ______x____x____x________y___y____y_ = U_22,
                ______x____x____x = U_22, _____x____x__ = U_22, _x_10 = U_22, _____y___y____y_ = U_22,
                ____y___y__ = U_22, _y_8 = U_22, _y_9 = U_22, _y_10 = U_22,
                v_23 = (______x____x____x________y___y____y_ = (______x____x____x = ((_____x____x__ = {["x"]: (_x_10 = x)})).x) == (_____y___y____y_ = ((____y___y__ = {[(_y_8 = y)]: (_y_9 = y)}))[(_y_10 = y)])),
                msg_23 = () => {
                    const v = void 0;
                    msg_23 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_23)
                throw new assert.upvalue_AssertionFailedError(v_23, msg_23(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "({ ['x']: x }).x == ({ [y]: y })[y]",
                            value: ______x____x____x________y___y____y_,
                            children: [{
                                expression: "({ ['x']: x }).x",
                                value: ______x____x____x,
                                children: [{
                                    expression: "{ ['x']: x }",
                                    value: _____x____x__,
                                    children: [{expression: "x", value: _x_10, children: []}]
                                }]
                            }, {
                                expression: "({ [y]: y })[y]",
                                value: _____y___y____y_,
                                children: [{
                                    expression: "{ [y]: y }",
                                    value: ____y___y__,
                                    children: [{expression: "y", value: _y_8, children: []}, {
                                        expression: "y",
                                        value: _y_9,
                                        children: []
                                    }]
                                }, {expression: "y", value: _y_10, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function NewExpression() {
        {
            let U_23 = assert.upvalue_getCallSiteDetails.UNEVALUATED,
                _new_Error_String_x___message____new_Error_String_y___message = U_23,
                _new_Error_String_x___message = U_23, _new_Error_String_x__ = U_23, _Error = U_23, _String_x_ = U_23,
                _x_11 = U_23, _new_Error_String_y___message = U_23, _new_Error_String_y__ = U_23, _Error_1 = U_23,
                _String_y_ = U_23, _y_11 = U_23,
                v_24 = (_new_Error_String_x___message____new_Error_String_y___message = (_new_Error_String_x___message = (_new_Error_String_x__ = new (_Error = Error)((_String_x_ = String((_x_11 = x))))).message) == (_new_Error_String_y___message = (_new_Error_String_y__ = new (_Error_1 = Error)((_String_y_ = String((_y_11 = y))))).message)),
                msg_24 = () => {
                    const v = void 0;
                    msg_24 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_24)
                throw new assert.upvalue_AssertionFailedError(v_24, msg_24(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "new Error(String(x)).message == new Error(String(y)).message",
                            value: _new_Error_String_x___message____new_Error_String_y___message,
                            children: [{
                                expression: "new Error(String(x)).message",
                                value: _new_Error_String_x___message,
                                children: [{
                                    expression: "new Error(String(x))",
                                    value: _new_Error_String_x__,
                                    children: [{
                                        expression: "Error",
                                        value: _Error,
                                        children: []
                                    }, {
                                        expression: "String(x)",
                                        value: _String_x_,
                                        children: [{expression: "x", value: _x_11, children: []}]
                                    }]
                                }]
                            }, {
                                expression: "new Error(String(y)).message",
                                value: _new_Error_String_y___message,
                                children: [{
                                    expression: "new Error(String(y))",
                                    value: _new_Error_String_y__,
                                    children: [{
                                        expression: "Error",
                                        value: _Error_1,
                                        children: []
                                    }, {
                                        expression: "String(y)",
                                        value: _String_y_,
                                        children: [{expression: "y", value: _y_11, children: []}]
                                    }]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function CallExpression() {
        {
            let U_24 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _String_x_____String_y_ = U_24,
                _String_x_1 = U_24, _x_12 = U_24, _String_y_1 = U_24, _y_12 = U_24,
                v_25 = (_String_x_____String_y_ = (_String_x_1 = String((_x_12 = x))) == (_String_y_1 = String((_y_12 = y)))),
                msg_25 = () => {
                    const v = void 0;
                    msg_25 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_25)
                throw new assert.upvalue_AssertionFailedError(v_25, msg_25(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "String(x) == String(y)",
                            value: _String_x_____String_y_,
                            children: [{
                                expression: "String(x)",
                                value: _String_x_1,
                                children: [{expression: "x", value: _x_12, children: []}]
                            }, {
                                expression: "String(y)",
                                value: _String_y_1,
                                children: [{expression: "y", value: _y_12, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    // function JsxElement() {},
    // function JsxSelfClosingElement() {},
    // function JsxFragment() {},
    // function TaggedTemplateExpression() {
    //     function tag<T extends readonly string[], S extends readonly unknown[]>(template: T, ...subs: S) {
    //         return {template, subs};
    //     }
    //     assert(tag`test${x}test`.subs[0] == y);
    // },
    function ArrayLiteralExpression() {
        {
            let U_25 = assert.upvalue_getCallSiteDetails.UNEVALUATED, __x__y__z__x_____z = U_25, __x__y__z__x_ = U_25,
                __x__y__z_ = U_25, _x_13 = U_25, _y_13 = U_25, _z_3 = U_25, _x_14 = U_25, _z_4 = U_25,
                v_26 = (__x__y__z__x_____z = (__x__y__z__x_ = (__x__y__z_ = [(_x_13 = x), (_y_13 = y), (_z_3 = z)])[(_x_14 = x)]) == (_z_4 = z)),
                msg_26 = () => {
                    const v = void 0;
                    msg_26 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_26)
                throw new assert.upvalue_AssertionFailedError(v_26, msg_26(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "[x, y, z][x] == z",
                            value: __x__y__z__x_____z,
                            children: [{
                                expression: "[x, y, z][x]",
                                value: __x__y__z__x_,
                                children: [{
                                    expression: "[x, y, z]",
                                    value: __x__y__z_,
                                    children: [{expression: "x", value: _x_13, children: []}, {
                                        expression: "y",
                                        value: _y_13,
                                        children: []
                                    }, {expression: "z", value: _z_3, children: []}]
                                }, {expression: "x", value: _x_14, children: []}]
                            }, {expression: "z", value: _z_4, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function ParenthesizedExpression() {
        {
            let U_26 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _______x_________2_____y_____2___ = U_26,
                _______x_________2 = U_26, _x_15 = U_26, _y_____2__ = U_26, _y_14 = U_26,
                v_27 = (_______x_________2_____y_____2___ = (_______x_________2 = (((((((_x_15 = x))))))) + 2) == ((_y_____2__ = (_y_14 = y) + ((2))))),
                msg_27 = () => {
                    const v = void 0;
                    msg_27 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_27)
                throw new assert.upvalue_AssertionFailedError(v_27, msg_27(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "((((((x)))))) + 2 == (y + ((2)))",
                            value: _______x_________2_____y_____2___,
                            children: [{
                                expression: "((((((x)))))) + 2",
                                value: _______x_________2,
                                children: [{expression: "x", value: _x_15, children: []}]
                            }, {
                                expression: "y + ((2))",
                                value: _y_____2__,
                                children: [{expression: "y", value: _y_14, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function ObjectLiteralExpression() {
        {
            let U_27 = assert.upvalue_getCallSiteDetails.UNEVALUATED,
                ____x__x__y____z____z__b_____return_x_____get_a_____return_x_______a____x = U_27,
                ____x__x__y____z____z__b_____return_x_____get_a_____return_x_______a = U_27,
                ___x__x__y____z____z__b_____return_x_____get_a_____return_x_____ = U_27, _x_16 = U_27, _z_5 = U_27,
                _x_17 = U_27, _x_18 = U_27, _x_19 = U_27,
                v_28 = (____x__x__y____z____z__b_____return_x_____get_a_____return_x_______a____x = (____x__x__y____z____z__b_____return_x_____get_a_____return_x_______a = ((___x__x__y____z____z__b_____return_x_____get_a_____return_x_____ = {
                    x: (_x_16 = x),
                    y: y,
                    ["z"]: (_z_5 = z),
                    b() {
                        return (_x_17 = x);
                    },
                    get a() {
                        return (_x_18 = x);
                    }
                })).a) == (_x_19 = x)), msg_28 = () => {
                    const v = void 0;
                    msg_28 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_28)
                throw new assert.upvalue_AssertionFailedError(v_28, msg_28(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "({ x: x, y, ['z']: z, b() { return x; }, get a() { return x; } }).a == x",
                            value: ____x__x__y____z____z__b_____return_x_____get_a_____return_x_______a____x,
                            children: [{
                                expression: "({ x: x, y, ['z']: z, b() { return x; }, get a() { return x; } }).a",
                                value: ____x__x__y____z____z__b_____return_x_____get_a_____return_x_______a,
                                children: [{
                                    expression: "{ x: x, y, ['z']: z, b() { return x; }, get a() { return x; } }",
                                    value: ___x__x__y____z____z__b_____return_x_____get_a_____return_x_____,
                                    children: [{expression: "x", value: _x_16, children: []}, {
                                        expression: "z",
                                        value: _z_5,
                                        children: []
                                    }, {expression: "x", value: _x_17, children: []}, {
                                        expression: "x",
                                        value: _x_18,
                                        children: []
                                    }]
                                }]
                            }, {expression: "x", value: _x_19, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function ClassExpression() {
        {
            let U_28 = assert.upvalue_getCallSiteDetails.UNEVALUATED,
                __new_class________q___5_______constructor_public_a___x__________a____x = U_28,
                __new_class________q___5_______constructor_public_a___x__________a = U_28,
                _new_class________q___5_______constructor_public_a___x________ = U_28, _x_20 = U_28,
                v_29 = (__new_class________q___5_______constructor_public_a___x__________a____x = (__new_class________q___5_______constructor_public_a___x__________a = ((_new_class________q___5_______constructor_public_a___x________ = new class {
                    constructor(a = x) {
                        this.a = a;
                        this.q = 5;
                    }
                })).a) == (_x_20 = x)), msg_29 = () => {
                    const v = void 0;
                    msg_29 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_29)
                throw new assert.upvalue_AssertionFailedError(v_29, msg_29(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "(new class {\r\n    q = 5;\r\n    constructor(public a = x) { }\r\n}).a == x",
                            value: __new_class________q___5_______constructor_public_a___x__________a____x,
                            children: [{
                                expression: "(new class {\r\n    q = 5;\r\n    constructor(public a = x) { }\r\n}).a",
                                value: __new_class________q___5_______constructor_public_a___x__________a,
                                children: [{
                                    expression: "new class {\r\n    q = 5;\r\n    constructor(public a = x) { }\r\n}",
                                    value: _new_class________q___5_______constructor_public_a___x________,
                                    children: []
                                }]
                            }, {expression: "x", value: _x_20, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function FunctionExpression() {
        {
            let U_29 = assert.upvalue_getCallSiteDetails.UNEVALUATED,
                __function__q__number____return_x___q_____2_____x___2 = U_29,
                __function__q__number____return_x___q_____2_ = U_29, _function__q__number____return_x___q___ = U_29,
                _x___q = U_29, _x_21 = U_29, _q = U_29, _x___2 = U_29, _x_22 = U_29,
                v_30 = (__function__q__number____return_x___q_____2_____x___2 = (__function__q__number____return_x___q_____2_ = ((_function__q__number____return_x___q___ = function (q) {
                    return (_x___q = (_x_21 = x) + (_q = q));
                }))(2)) == (_x___2 = (_x_22 = x) + 2)), msg_30 = () => {
                    const v = void 0;
                    msg_30 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_30)
                throw new assert.upvalue_AssertionFailedError(v_30, msg_30(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "(function (q: number) { return x + q; })(2) == x + 2",
                            value: __function__q__number____return_x___q_____2_____x___2,
                            children: [{
                                expression: "(function (q: number) { return x + q; })(2)",
                                value: __function__q__number____return_x___q_____2_,
                                children: [{
                                    expression: "function (q: number) { return x + q; }",
                                    value: _function__q__number____return_x___q___,
                                    children: [{
                                        expression: "x + q",
                                        value: _x___q,
                                        children: [{expression: "x", value: _x_21, children: []}, {
                                            expression: "q",
                                            value: _q,
                                            children: []
                                        }]
                                    }]
                                }]
                            }, {
                                expression: "x + 2",
                                value: _x___2,
                                children: [{expression: "x", value: _x_22, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function Identifier() {
        {
            let U_30 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x_23 = U_30, v_31 = (_x_23 = x), msg_31 = () => {
                const v = void 0;
                msg_31 = () => v;
                return v;
            };
            assert.upvalue_testUpvalue++;
            if (!v_31)
                throw new assert.upvalue_AssertionFailedError(v_31, msg_31(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {expression: "x", value: _x_23, children: []}
                    }]
                }))()?.params[0]);
        }
    },
    function RegularExpressionLiteral() {
        {
            let U_31 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x_toString___match___2___ = U_31,
                _x_toString__ = U_31, _x_24 = U_31,
                v_32 = (_x_toString___match___2___ = (_x_toString__ = (_x_24 = x).toString()).match(/^2$/)),
                msg_32 = () => {
                    const v = void 0;
                    msg_32 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_32)
                throw new assert.upvalue_AssertionFailedError(v_32, msg_32(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "x.toString().match(/^2$/)",
                            value: _x_toString___match___2___,
                            children: [{
                                expression: "x.toString()",
                                value: _x_toString__,
                                children: [{expression: "x", value: _x_24, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function NumericLiteral() {
        {
            let U_32 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _x___2____x___1___3 = U_32, _x___2_1 = U_32,
                _x_25 = U_32, _x___1___3 = U_32, _x___1 = U_32, _x_26 = U_32,
                v_33 = (_x___2____x___1___3 = (_x___2_1 = (_x_25 = x) + 2) == (_x___1___3 = (_x___1 = (_x_26 = x) - 1) + 3)),
                msg_33 = () => {
                    const v = void 0;
                    msg_33 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_33)
                throw new assert.upvalue_AssertionFailedError(v_33, msg_33(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "x + 2 == x - 1 + 3",
                            value: _x___2____x___1___3,
                            children: [{
                                expression: "x + 2",
                                value: _x___2_1,
                                children: [{expression: "x", value: _x_25, children: []}]
                            }, {
                                expression: "x - 1 + 3",
                                value: _x___1___3,
                                children: [{
                                    expression: "x - 1",
                                    value: _x___1,
                                    children: [{expression: "x", value: _x_26, children: []}]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function BigIntLiteral() {
        {
            let U_33 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _123456789n___2n___BigInt_x_ = U_33,
                _2n___BigInt_x_ = U_33, _BigInt_x_ = U_33, _x_27 = U_33,
                v_34 = (_123456789n___2n___BigInt_x_ = 123456789n > (_2n___BigInt_x_ = 2n + (_BigInt_x_ = BigInt((_x_27 = x))))),
                msg_34 = () => {
                    const v = void 0;
                    msg_34 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_34)
                throw new assert.upvalue_AssertionFailedError(v_34, msg_34(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "123456789n > 2n + BigInt(x)",
                            value: _123456789n___2n___BigInt_x_,
                            children: [{
                                expression: "2n + BigInt(x)",
                                value: _2n___BigInt_x_,
                                children: [{
                                    expression: "BigInt(x)",
                                    value: _BigInt_x_,
                                    children: [{expression: "x", value: _x_27, children: []}]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function StringLiteral() {
        {
            let U_34 = assert.upvalue_getCallSiteDetails.UNEVALUATED, __test____x_____test____y = U_34,
                __test____x = U_34, _x_28 = U_34, __test____y = U_34, _y_15 = U_34,
                v_35 = (__test____x_____test____y = (__test____x = "test" + (_x_28 = x)) == (__test____y = "test" + (_y_15 = y))),
                msg_35 = () => {
                    const v = void 0;
                    msg_35 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_35)
                throw new assert.upvalue_AssertionFailedError(v_35, msg_35(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "'test' + x == \"test\" + y",
                            value: __test____x_____test____y,
                            children: [{
                                expression: "'test' + x",
                                value: __test____x,
                                children: [{expression: "x", value: _x_28, children: []}]
                            }, {
                                expression: "\"test\" + y",
                                value: __test____y,
                                children: [{expression: "y", value: _y_15, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function NoSubstitutionTemplateLiteral() {
        {
            let U_35 = assert.upvalue_getCallSiteDetails.UNEVALUATED, __test____x_____test____y_1 = U_35,
                __test____x_1 = U_35, _x_29 = U_35, __test____y_1 = U_35, _y_16 = U_35,
                v_36 = (__test____x_____test____y_1 = (__test____x_1 = `test` + (_x_29 = x)) == (__test____y_1 = `test` + (_y_16 = y))),
                msg_36 = () => {
                    const v = void 0;
                    msg_36 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_36)
                throw new assert.upvalue_AssertionFailedError(v_36, msg_36(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "`test` + x == `test` + y",
                            value: __test____x_____test____y_1,
                            children: [{
                                expression: "`test` + x",
                                value: __test____x_1,
                                children: [{expression: "x", value: _x_29, children: []}]
                            }, {
                                expression: "`test` + y",
                                value: __test____y_1,
                                children: [{expression: "y", value: _y_16, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function TemplateExpression() {
        {
            let U_36 = assert.upvalue_getCallSiteDetails.UNEVALUATED, ____x_test________y_test_ = U_36,
                ____x_test_ = U_36, _x_30 = U_36, ____y_test_ = U_36, _y_17 = U_36,
                v_37 = (____x_test________y_test_ = (____x_test_ = `${(_x_30 = x)}test`) == (____y_test_ = `${(_y_17 = y)}test`)),
                msg_37 = () => {
                    const v = void 0;
                    msg_37 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_37)
                throw new assert.upvalue_AssertionFailedError(v_37, msg_37(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "`${x}test` == `${y}test`",
                            value: ____x_test________y_test_,
                            children: [{
                                expression: "`${x}test`",
                                value: ____x_test_,
                                children: [{expression: "x", value: _x_30, children: []}]
                            }, {
                                expression: "`${y}test`",
                                value: ____y_test_,
                                children: [{expression: "y", value: _y_17, children: []}]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function FalseKeyword() {
        {
            let U_37 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _false_____true = U_37, __true = U_37,
                v_38 = (_false_____true = false == (__true = !true)), msg_38 = () => {
                    const v = void 0;
                    msg_38 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_38)
                throw new assert.upvalue_AssertionFailedError(v_38, msg_38(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "false == !true",
                            value: _false_____true,
                            children: [{expression: "!true", value: __true, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function NullKeyword() {
        {
            let U_38 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _null______ = U_38, ___ = U_38,
                v_39 = (_null______ = null != (___ = {})), msg_39 = () => {
                    const v = void 0;
                    msg_39 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_39)
                throw new assert.upvalue_AssertionFailedError(v_39, msg_39(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "null != {}",
                            value: _null______,
                            children: [{expression: "{}", value: ___, children: []}]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function ThisKeyword() {
        {
            let U_39 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _this_____this = U_39,
                v_40 = (_this_____this = this === this), msg_40 = () => {
                    const v = void 0;
                    msg_40 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_40)
                throw new assert.upvalue_AssertionFailedError(v_40, msg_40(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {expression: "this === this", value: _this_____this, children: []}
                    }]
                }))()?.params[0]);
        }
    },
    function SuperKeyword() {
        new class extends Error {
            constructor() {
                super('test');
                {
                    let U_40 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _super_message____super_message = U_40,
                        _super_message = U_40, _super_message_1 = U_40,
                        v_41 = (_super_message____super_message = (_super_message = super.message) == (_super_message_1 = super.message)),
                        msg_41 = () => {
                            const v = void 0;
                            msg_41 = () => v;
                            return v;
                        };
                    assert.upvalue_testUpvalue++;
                    if (!v_41)
                        throw new assert.upvalue_AssertionFailedError(v_41, msg_41(), (() => ({
                            params: [{
                                name: "v",
                                rootPart: {
                                    expression: "super.message == super.message",
                                    value: _super_message____super_message,
                                    children: [{
                                        expression: "super.message",
                                        value: _super_message,
                                        children: []
                                    }, {expression: "super.message", value: _super_message_1, children: []}]
                                }
                            }]
                        }))()?.params[0]);
                }
            }
        };
    },
    // function NonNullExpression() {},
    function MetaProperty() {
        function metaProperty() {
            {
                let U_41 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _new_target = U_41,
                    v_42 = (_new_target = (new.target)), msg_42 = () => {
                        const v = void 0;
                        msg_42 = () => v;
                        return v;
                    };
                assert.upvalue_testUpvalue++;
                if (!v_42)
                    throw new assert.upvalue_AssertionFailedError(v_42, msg_42(), (() => ({
                        params: [{
                            name: "v",
                            rootPart: {expression: "new.target", value: _new_target, children: []}
                        }]
                    }))()?.params[0]);
            }
        }
    },
    // function ImportKeyword() { try{ assert(import('fail')) } catch(e) {}; }
    // special
    function AssignmentOperator() {
        let a, b, c, o = {d: 0};
        {
            let U_42 = assert.upvalue_getCallSiteDetails.UNEVALUATED, _a___b___c___o_d___4 = U_42,
                _b___c___o_d___4 = U_42, _c___o_d___4 = U_42, _o_d___4 = U_42, _o_1 = U_42,
                v_43 = (_a___b___c___o_d___4 = a = (_b___c___o_d___4 = b = (_c___o_d___4 = c = (_o_d___4 = (_o_1 = o).d = 4)))),
                msg_43 = () => {
                    const v = void 0;
                    msg_43 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_43)
                throw new assert.upvalue_AssertionFailedError(v_43, msg_43(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "a = b = c = o.d = 4",
                            value: _a___b___c___o_d___4,
                            children: [{
                                expression: "b = c = o.d = 4",
                                value: _b___c___o_d___4,
                                children: [{
                                    expression: "c = o.d = 4",
                                    value: _c___o_d___4,
                                    children: [{
                                        expression: "o.d = 4",
                                        value: _o_d___4,
                                        children: [{expression: "o", value: _o_1, children: []}]
                                    }]
                                }]
                            }]
                        }
                    }]
                }))()?.params[0]);
        }
    },
    function Nested() {
        {
            let U_43 = assert.upvalue_getCallSiteDetails.UNEVALUATED,
                _onlyDefined_onlyDefined_onlyDefined_onlyDefined_x____y____ = U_43,
                v_44 = (_onlyDefined_onlyDefined_onlyDefined_onlyDefined_x____y____ = (() => {
                    let U_44 = onlyDefined.upvalue_getCallSiteDetails.UNEVALUATED,
                        _onlyDefined_onlyDefined_onlyDefined_x____y___ = U_44,
                        v_45 = (_onlyDefined_onlyDefined_onlyDefined_x____y___ = (() => {
                            let U_45 = onlyDefined.upvalue_getCallSiteDetails.UNEVALUATED,
                                _onlyDefined_onlyDefined_x____y__ = U_45,
                                v_46 = (_onlyDefined_onlyDefined_x____y__ = (() => {
                                    let U_46 = onlyDefined.upvalue_getCallSiteDetails.UNEVALUATED,
                                        _onlyDefined_x____y_ = U_46, v_47 = (_onlyDefined_x____y_ = (() => {
                                            let U_47 = onlyDefined.upvalue_getCallSiteDetails.UNEVALUATED, _x____y_1 = U_47,
                                                _x_31 = U_47, _y_18 = U_47, v_48 = (_x____y_1 = (_x_31 = x) == (_y_18 = y)),
                                                msg_48 = () => {
                                                    const v = void 0;
                                                    msg_48 = () => v;
                                                    return v;
                                                };
                                            onlyDefined.upvalue_testUpvalue++;
                                            if (v_48 === undefined || v_48 === null)
                                                throw new onlyDefined.upvalue_AssertionFailedError(v_48, msg_48(), (() => ({
                                                    params: [{
                                                        name: "v",
                                                        rootPart: {
                                                            expression: "x == y",
                                                            value: _x____y_1,
                                                            children: [{
                                                                expression: "x",
                                                                value: _x_31,
                                                                children: []
                                                            }, {expression: "y", value: _y_18, children: []}]
                                                        }
                                                    }]
                                                }))()?.params[0]);
                                            return v_48;
                                        })()), msg_47 = () => {
                                            const v = void 0;
                                            msg_47 = () => v;
                                            return v;
                                        };
                                    onlyDefined.upvalue_testUpvalue++;
                                    if (v_47 === undefined || v_47 === null)
                                        throw new onlyDefined.upvalue_AssertionFailedError(v_47, msg_47(), (() => ({
                                            params: [{
                                                name: "v",
                                                rootPart: {
                                                    expression: "onlyDefined(x == y)",
                                                    value: _onlyDefined_x____y_,
                                                    children: []
                                                }
                                            }]
                                        }))()?.params[0]);
                                    return v_47;
                                })()), msg_46 = () => {
                                    const v = void 0;
                                    msg_46 = () => v;
                                    return v;
                                };
                            onlyDefined.upvalue_testUpvalue++;
                            if (v_46 === undefined || v_46 === null)
                                throw new onlyDefined.upvalue_AssertionFailedError(v_46, msg_46(), (() => ({
                                    params: [{
                                        name: "v",
                                        rootPart: {
                                            expression: "onlyDefined(onlyDefined(x == y))",
                                            value: _onlyDefined_onlyDefined_x____y__,
                                            children: []
                                        }
                                    }]
                                }))()?.params[0]);
                            return v_46;
                        })()), msg_45 = () => {
                            const v = void 0;
                            msg_45 = () => v;
                            return v;
                        };
                    onlyDefined.upvalue_testUpvalue++;
                    if (v_45 === undefined || v_45 === null)
                        throw new onlyDefined.upvalue_AssertionFailedError(v_45, msg_45(), (() => ({
                            params: [{
                                name: "v",
                                rootPart: {
                                    expression: "onlyDefined(onlyDefined(onlyDefined(x == y)))",
                                    value: _onlyDefined_onlyDefined_onlyDefined_x____y___,
                                    children: []
                                }
                            }]
                        }))()?.params[0]);
                    return v_45;
                })()), msg_44 = () => {
                    const v = void 0;
                    msg_44 = () => v;
                    return v;
                };
            assert.upvalue_testUpvalue++;
            if (!v_44)
                throw new assert.upvalue_AssertionFailedError(v_44, msg_44(), (() => ({
                    params: [{
                        name: "v",
                        rootPart: {
                            expression: "onlyDefined(onlyDefined(onlyDefined(onlyDefined(x == y))))",
                            value: _onlyDefined_onlyDefined_onlyDefined_onlyDefined_x____y____,
                            children: []
                        }
                    }]
                }))()?.params[0]);
        }
    }
];
for (const test of tests) {
    test();
}
/*********************/
/*********************/
// assert(fs.appendFileSync);
