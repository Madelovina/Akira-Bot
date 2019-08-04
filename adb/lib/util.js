"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the current time in hh:mm:ss format.
 */
function getTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}
exports.getTime = getTime;
/**
 * Returns a string which is at least `paddingLength` characters
 * long with `str` at the start.
 * @param str The string to add padding to.
 * @param paddingLength The length to pad the string to.
 */
function padString(str, paddingLength) {
    if (str.length > paddingLength) {
        return str;
    }
    return (str + ' '.repeat(paddingLength - str.length));
}
exports.padString = padString;
/**
 * Invokes `func` in a try/catch block and ignores any errors.
 * @param func The function to invoke safely.
 */
function safely(func) {
    try {
        func();
    }
    catch (error) {
    }
}
exports.safely = safely;
//# sourceMappingURL=util.js.map