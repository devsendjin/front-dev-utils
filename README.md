# front-dev-utils

Small utilities for front-end development. Right now it adds **caller-aware console helpers** you can use from the browser console or app code.

## What you get

Import the package once (side effect only). It attaches:

- **`window.llog(...args)`** — logs with a `[ClassName.method]` or `[functionName]` prefix from the stack trace.
- **`window.llogc(...args)`** — clears the console, then logs the same way.

TypeScript picks up `llog` / `llogc` on `Window` via the published types.

## Usage

```ts
import "front-dev-utils"; // import in root file of your app/package

// In app code or DevTools:
// just log
llog("value", obj);

// clear and log
llogc("value", obj);
```
