/**
 * Describes the color which will be used to print the message to the console.
 */
export declare enum LogLevel {
    Info = 0,
    Message = 1,
    Warning = 2,
    Error = 3,
    Success = 4,
}
/**
 * A function which can be used to log messages to the console in a friendly format.
 */
export declare type Logger = (message: string | Error | object, logLevel?: LogLevel) => void;
/**
 * Creates a `Logger` which is bound to the `creator`.
 * @param creator The object which the logger belongs to.
 */
export declare function createLogger(creator: string): Logger;
