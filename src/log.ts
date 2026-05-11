const nativeConsoleLog = console.log.bind(console);

/**
 * Enhanced logging function that uses TypeScript reflection to automatically include
 * the calling function or class name in the log output.
 *
 * @param args - The arguments to log
 * @returns void
 *
 * @example
 * // In a class method:
 * log("Debug info", someValue); // Output: "[ClassName.methodName] Debug info someValue"
 *
 * // In a standalone function:
 * log("Error occurred"); // Output: "[functionName] Error occurred"
 */
// First line is the "Error" message; then each logging helper adds a frame. The real caller is
// always the line after `log` / `clearAndLog` → index 3 in both paths:
// [0] Error, [1] logWithCallerLine, [2] log | clearAndLog, [3] caller
const CALLER_LINE_INDEX = 3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logWithCallerLine(args: any[]): void {
  const stack = new Error().stack;
  if (!stack) {
    nativeConsoleLog(...args);
    return;
  }

  // console.log("stack", stack);
  // console.log("stack.split(\"\n\")", stack.split("\n"));
  // console.log("callingLine", stack.split("\n")[CALLER_LINE_INDEX]);

  const stackLines = stack.split("\n");
  const callingLine = stackLines[CALLER_LINE_INDEX];
  if (!callingLine) {
    nativeConsoleLog(...args);
    return;
  }

  // Extract function/class name from stack trace
  // Pattern: "    at ClassName.methodName (file:line:column)" or "    at functionName (file:line:column)"
  const match = callingLine.match(/\s+at\s+(?:(\w+)\.)?(\w+)\s+\(/);

  let callerName = "";
  if (match) {
    const className = match[1];
    const methodName = match[2];
    callerName = className ? `${className}.${methodName}` : methodName;
  }

  if (!callerName) {
    nativeConsoleLog(...args);
    return;
  }

  nativeConsoleLog(`[${callerName}]`, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (...args: any[]): void => {
  logWithCallerLine(args);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearAndLog = (...args: any[]): void => {
  console.clear();
  logWithCallerLine(args);
};

globalThis.llog = log;
globalThis.llogc = clearAndLog;
