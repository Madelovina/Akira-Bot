"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const util_1 = require("./util");
/**
 * Describes the color which will be used to print the message to the console.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Message"] = 1] = "Message";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Success"] = 4] = "Success";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Creates a `Logger` which is bound to the `creator`.
 * @param creator The object which the logger belongs to.
 */
function createLogger(creator) {
    return log.bind(creator);
}
exports.createLogger = createLogger;
function log(message, logLevel = LogLevel.Message) {
    const senderString = `[${util_1.getTime()} | ${this}]`;
    let actualMessage;
    if (message instanceof Error) {
        actualMessage = message.message;
    }
    else if (typeof message === 'string') {
        actualMessage = message;
    }
    else {
        actualMessage = message.toString();
    }
    let printString = util_1.padString(senderString, 30) + actualMessage;
    switch (logLevel) {
        case LogLevel.Info:
            printString = chalk_1.default.gray(printString);
            break;
        case LogLevel.Message:
            printString = chalk_1.default.white(printString);
            break;
        case LogLevel.Warning:
            printString = chalk_1.default.yellow(printString);
            break;
        case LogLevel.Error:
            printString = chalk_1.default.red(printString);
            break;
        case LogLevel.Success:
            printString = chalk_1.default.green(printString);
            break;
    }
    console.log(printString);
}
//# sourceMappingURL=log.js.map