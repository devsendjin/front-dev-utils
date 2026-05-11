import { clearAndLog, log } from "./log";

declare global {
  var llog: typeof log;
  var llogc: typeof clearAndLog;
}

export {};
