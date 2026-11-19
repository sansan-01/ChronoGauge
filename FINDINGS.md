# ChronoGauge hardening audit

HTML_RESTYLE: 杂志编辑风 (status: pending owner-side aesthetic review).

The audit covered the current checkout, including the static page, Cloudflare Pages Function, documentation, and GitHub funding configuration. No suspected credentials, package dependencies requiring a lockfile, CI workflows, or unintended tracked build outputs were found. The tracked favicon is a page asset. Production Cloudflare settings were outside the checkout.

| Severity | Location | One-line risk | Fix applied |
| --- | --- | --- | --- |
| medium | `functions/api/time.js:7` | Cached timestamps can make calibration display a false offset and an incorrect estimated time. | Added `Cache-Control: no-store` to the endpoint and bypassed the browser cache for each sample. |
| medium | `index.html:312` | A stalled fetch or response body can leave the calibration button disabled indefinitely. | Added a 10-second abort deadline for the full sampling run and clear it when the run finishes. |
| medium | `index.html:328` | Missing, mistyped, or out-of-range timestamps can corrupt the offset and clock readout. | Validate that each timestamp is an integer within the JavaScript date range before using it. |
| low | `index.html:302` | An automatic sync can overlap a manual run and overwrite its results or change the button state prematurely. | Skip incoming sync attempts while calibration is active. |
| low | `index.html:316` | Device clock changes can distort round-trip latency and cause the wrong sample to win. | Measure RTT with a monotonic clock and fail calibration if the device clock shifts by more than 100 ms relative to it. |
| low | `index.html:353` | Rendering results through an HTML sink creates an XSS regression risk if future formatting includes untrusted text. | Render status text and the numeric span with text nodes, with the span styled in CSS. |
| low | `functions/api/time.js:12` | The read-only endpoint accepted unsupported methods and returned JSON without disabling MIME sniffing. | Serve GET and HEAD, reject other methods with `405` and an `Allow` header, and set `X-Content-Type-Options: nosniff`. |
| low | `index.html:9` | The remote font stylesheet exposed page loads to a third party and introduced an unversioned runtime dependency. | Removed the Google Fonts import and used local serif and sans-serif fallback stacks. |
| low | `.gitignore:1` | Local environment files, Cloudflare state, editor files, and generated output could be committed accidentally. | Added ignore rules for local configuration, caches, and common generated directories. |
| low | `README.md:7` | The documented atomic-time claim overstates the guarantee provided by the edge runtime clock and symmetric-delay estimate. | Report-only. The requested README edit was append-only, and changing the time source would change deployment and calibration behavior. |

Local checks covered the function's HTTP methods, freshness headers and timestamp response, plus calibration success, both offset directions, malformed responses, timeout recovery, overlapping attempts, and a device clock jump. Static HTML markup and copy matched the original.

Screenshot capture failed. The sandbox denied socket creation for the requested Python server on port 8931, and Chromium and its headless shell also failed to start because the sandbox denied socket operations. No `docs/preview-editorial.png` was produced.
Screenshot retaken by coordinator outside sandbox: docs/preview-editorial.png (pending aesthetic review).
