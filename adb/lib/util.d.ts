/**
 * Returns the current time in hh:mm:ss format.
 */
export declare function getTime(): string;
/**
 * Returns a string which is at least `paddingLength` characters
 * long with `str` at the start.
 * @param str The string to add padding to.
 * @param paddingLength The length to pad the string to.
 */
export declare function padString(str: string, paddingLength: number): string;
/**
 * Invokes `func` in a try/catch block and ignores any errors.
 * @param func The function to invoke safely.
 */
export declare function safely(func: (...args: any[]) => any): void;
