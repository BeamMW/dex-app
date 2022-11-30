import { isFloat, isNumeric } from "@app/library/base/appUtils";

export function isAmountValid(value) {
    const dotRegexp = new RegExp(/\./g);
    const allowedCharactersRegexp = new RegExp(/^[0-9,\.,\,]*$/g);
    const splits = value.toString().split('.');
    //console.log("splits", splits);

    if ((value[0] == '0' && (!!value[1] && !['.'].includes(value[1])))) {
        return;
    }

    if (((value.match(dotRegexp) || []).length > 1)) {
        //console.log("(((value.match(dotRegexp) || []).length > 1)", (((value.match(dotRegexp) || []).length > 1)))
        return;
    }

    if (!((!!value && (isNumeric(value) || isFloat(value))) || !value)) {
        //console.log("(!((!!value && (isNumeric(value) || isFloat(value))) || !value)", (!((!!value && (isNumeric(value) || isFloat(value))) || !value)))
        return;
    }

    if (splits[0].length > 9 && splits[0][splits[0].length - 1] != '.') {
        //console.log("splits[0].length > 8 && splits[0][splits[0].length - 1] != '.'", splits[0].length > 8 && splits[0][splits[0].length - 1] != '.');
        return;
    }

    if (dotRegexp.test(value) && splits[1].length > 8) {
        //console.log("dotRegexp.test(value) && splits[1].length > 2", dotRegexp.test(value) && splits[1].length > 2);
        return;
    }

    if (!allowedCharactersRegexp.test(value)) {
        //console.log("!allowedCharactersRegexp.test(value)", !allowedCharactersRegexp.test(value));
        return;
    }

    if (value < 0) {
        return;
    }

    return true;
}

export function amountHandler(value, handler) {
    console.log("isAmountValid", !!isAmountValid(value));
    //console.log("value", value);
    !!isAmountValid(value) && handler(value);
}

export const keyPressAmountHandler = (e) => {
    if (!/[0-9\b\.]/g.test(e.key)) {
        e.preventDefault();
    }
}