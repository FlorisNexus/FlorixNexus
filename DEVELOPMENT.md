Local development notes — HTTPS with Vite
=====================================

This file documents how to run the Vite dev server over HTTPS on Windows for testing features that require secure origins (reCAPTCHA, service workers, etc.).

## Automated Setup (Recommended)
Run this once to install mkcert and generate trusted certificates:
```bash
npm run setup-https
```
**Prerequisites**: Chocolatey must be installed (for mkcert). If not, install it from [chocolatey.org/install](https://chocolatey.org/install) and run the command again.

This will:
- Install mkcert via Chocolatey (if not already installed).
- Set up the local CA.
- Generate certificates for localhost.
- Move them to `./certs/localhost.pem` and `./certs/localhost-key.pem`.
Then restart the dev server with `npm run dev` — no browser warnings!

## Manual Setup

1) Recommended: mkcert (creates locally-trusted certs)

- Install mkcert (Chocolatey):

```powershell
choco install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

This will create cert files in the current directory like `localhost+2.pem` and `localhost+2-key.pem`. Move/rename them into the project `certs/` folder as `localhost.pem` and `localhost-key.pem`.

2) Alternative: OpenSSL (self-signed, browser will warn unless you trust it)

```powershell
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout .\certs\localhost-key.pem -out .\certs\localhost.pem -days 365 -subj "/CN=localhost"
```

3) Start the dev server (config in `vite.config.js` will use certs if present, otherwise Vite generates a self-signed cert):

```powershell
# start dev server (uses vite.config.js https setting)
npm run dev
```

4) Notes
- `dist` is only needed for production builds (`npm run build`). Vite serves from memory while running `npm run dev` (HMR).
- If your site key for reCAPTCHA is origin-restricted, add the exact origin you use (e.g. `https://localhost:3000`) to the allowed origins in the reCAPTCHA console.