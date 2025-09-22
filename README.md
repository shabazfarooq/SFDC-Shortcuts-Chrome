# SFDC Shortcuts Chrome Extension

Small Chrome extension that adds keyboard shortcuts to quickly navigate Salesforce admin pages (Developer Console, Setup, Objects) and to run a "goToThisObject" action that opens the current object's Edit page.

---

## Files of interest

- `background.js` — Service worker contains command handlers and navigation helpers. It uses `chrome.scripting.executeScript` to inject the DOM interactions for the `goToThisObject` command into the active tab.
- `content.js` — Currently empty. The extension uses `scripting.executeScript` from `background.js` to run the DOM code directly in the page.
- `manifest.json` — Extension manifest (Manifest V3). Declares `commands`, `permissions`, `host_permissions` and `content_scripts`.

---

## How it works (current implementation)

- Keyboard shortcuts are declared in `manifest.json` under `commands`.
- For simple navigations (`goToSfdcDevConsole`, `goToSfdcSetup`, `goToSfdcObjects`) the service worker builds the correct URL (accounting for Lightning vs Classic) and either opens a new tab or updates the current tab.
- For `goToThisObject`, the current `background.js` queries the active tab and uses `chrome.scripting.executeScript` to run a function in the page context that:
  1. Finds and clicks the Setup menu
  2. Waits for the menu to render
  3. Finds and clicks the "Edit Object" menu item

This approach keeps DOM-manipulating code inside the page and avoids attempting to access `document` from the service worker.

---

## How to install locally

1. Open Chrome and go to `chrome://extensions/`.
2. Enable *Developer mode* (top-right).
3. Click *Load unpacked* and select this repository folder (`SFDC-Shortcuts-Chrome`).
4. Confirm the extension appears and the service worker is registered.

## How to test `goToThisObject`

1. Open a Salesforce page (Lightning page where the Setup menu is visible), for example any record page.
2. Use the keyboard shortcut for `goToThisObject` (default `Alt+J`).
3. Observe the page's console (DevTools -> Console) — it should log messages like `Setup button clicked!` and `Edit Object button clicked!` if successful.

If nothing happens, check the extension service worker console (Extensions page -> Inspect views -> service worker) for errors. Typical failure modes:

- `scripting.executeScript` fails because active tab doesn't match `host_permissions` or the tab isn't a normal web page (e.g., chrome://). Ensure the tab is `https://*.salesforce.com/*` or `https://*.force.com/*`.
- DOM selectors fail because Salesforce changed the structure, or the page is slow to render. Consider increasing retry delays or using a MutationObserver.

---

## Code review notes and suggestions

1. Using `chrome.scripting.executeScript` is appropriate — it executes in the page and can interact with `document` directly. The current `goToThisObject` implementation uses a retry loop with `setTimeout` which is simple and effective but could be improved.

2. Robustness improvements:
  - Replace fixed-time retries with a `MutationObserver` that watches for the menu/menuitem to appear, and fallback to a timeout (e.g., 3 seconds) before giving up.
  - Add a maximum retry count for the recursive `setTimeout` to avoid infinite retries in edge cases.
  - Consider exposing a small UI (toast or notification) to indicate success or failure rather than relying only on console logs.

3. Internationalization/locales:
  - The code matches explicit English text values (`'Setup'`, `'Edit Object'`). If your orgs use non-English UI, the selectors will fail. Prefer using stable attributes (data-attributes, aria-labels) if present. Otherwise allow customizing the strings via extension options.

4. Content script vs injection:
  - You currently inject the function via `scripting.executeScript(func: ...)`. Another approach is to place the function in `content.js` and expose a message listener to invoke it. That makes the code easier to test and edit without modifying the service worker. However, injection is fine and sometimes required when the page needs the script in its own context.

5. Empty `content.js` file:
  - Since `content.js` is empty and `manifest.json` still registers it, you can remove it from `manifest.json` if you don't plan to use it, or add a small listener there if you want to move the DOM code into a content script.

6. Error handling and logging:
  - Add `try/catch` around DOM code to surface exceptions back to the service worker (use `postMessage` back or console logs). Currently errors will only appear in the page console.

---

## Suggested minimal improvements (I can implement any of these)

- Implement `MutationObserver`-based waiting for the menu item instead of repeated `setTimeout`/retry.
- Add a maximum retry count to prevent indefinite retries.
- Move DOM code into `content.js` with a `chrome.runtime.onMessage` listener to keep `background.js` smaller.
- Add a small README how-to for contributors.

---

## Next steps

If you want, I can implement one of the suggested improvements now. Tell me which:

- `mutation-observer` — Replace timeout-based retry with mutation observer and timeout fallback.
- `content-listener` — Move injected code into `content.js` and have `background.js` message the content script.
- `i18n` — Make selectors configurable for multiple locales.

Otherwise, this README should give enough instructions to load and test the extension.
