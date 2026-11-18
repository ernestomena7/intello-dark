# Hosting spike (tasks T006 to T008)

Throwaway app that answers the open Hostinger questions. **Deploy on a temporary domain, never the production one**, and delete it after recording the results.

## Deploy
1. Upload the `spike/` folder contents (`server.js`, `package.json`) as a new Node.js Web App in hPanel (GitHub or ZIP). Node **24.x**, entry file `server.js`.
2. Set environment variables: `SMTP_HOST` (for example `smtp.hostinger.com`), `SMTP_USER` (the full mailbox), `SMTP_PASS`. Do not set `PORT`.
3. Open `https://<temporary-domain>/healthz`; it must show `{"status":"ok"}`.

## Checks (run from your own machine) and what to send back
| Step | Command or page | Record |
|------|-----------------|--------|
| S1 port | `GET /spike/env` | `portEnvIsSet`, `portEnvValueKind`, `listeningOn` |
| S7 Node and install | hPanel Node selector, build log | Node 24 selectable? `npm install` duration |
| S2 SMTP | `GET /spike/smtp` | `ok`, `code` and `responseCode` for port 465 and 587 |
| S3 proxy | `GET /spike/headers` | `xForwardedFor`, `xForwardedProto`, `remoteAddress`; how many proxy hops |
| S8 HTTPS | the same page over `https://` | `xForwardedProto` is `https`? certificate valid on the domain? |
| S5 redirect caching | `curl -sI -H "Accept-Language: en" https://<domain>/spike/redirect` then the same with `es`, twice each | `location` follows the header every time; any `age` or `x-cache` header |
| S6 compression | `curl -s -o /dev/null -w "%{size_download}\n" -H "Accept-Encoding: gzip, br" https://<domain>/spike/big` and again with `Accept-Encoding: identity` | Different sizes? `content-encoding` header |
| S4 cold start | wait until the app has been idle (about 30 minutes), then `curl -s -o /dev/null -w "%{time_total}\n" https://<domain>/healthz` | Seconds for the first request, then the next |

Send the output of each step. T008 turns it into decisions in `research.md` and deletes this folder.
