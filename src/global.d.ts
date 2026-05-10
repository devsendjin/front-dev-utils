import { clearAndLog, log } from "./log";

declare global {
  const llog: typeof log;
  const llogc: typeof clearAndLog;

  interface Window {
    llog: typeof log;
    llogc: typeof clearAndLog;
  }
}

export {};
