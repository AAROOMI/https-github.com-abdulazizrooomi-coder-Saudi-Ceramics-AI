# Saudi Ceramics WebView Assistant — prototype

A separate Android wrapper that loads the currently published Saudi Ceramics AI Studio URL and injects the user's existing D-ID floating agent. It does not modify the original website or official Saudi Ceramics application.

## Included
- Existing app URL loaded in Android WebView.
- Existing D-ID agent embed injected after page load.
- Android runtime microphone permission and WebView audio capture handling.
- GitHub Actions workflow to build a debug APK.

## Before testing
1. In D-ID, ensure the client key is allowed to run on the hosted app domain: `saudi-ceramics-ai-1.ai.studio`.
2. Confirm the current agent and client key are active.
3. The APK is a prototype wrapper, not an official Saudi Ceramics release.

## Functional limitation
This prototype embeds the voice/avatar UI only. It does not yet perform product search, select variants, manipulate the cart, or submit checkout/payment. Those actions require the live site's UI/API contract and D-ID tool handlers. No payment action is implemented.

## Build output
The GitHub Actions workflow produces an artifact named `saudi-ceramics-webview-debug-apk`. Open the repository's Actions tab, select the successful build run, and download the artifact.
