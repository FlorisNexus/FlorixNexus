Local development & build notes — Vite, HTTPS, and CI
===================================================

This document explains the recommended local dev flow (Vite), how to get trusted HTTPS locally (mkcert), and how the production build & CI are configured.

## Quick start (recommended)

1. Install dependencies:

```powershell
npm install
```

2. Create trusted local certs (one-time):

```powershell
npm run setup-https
```

3. Start the dev server (HTTPS + HMR):

```powershell
npm run dev
```

The dev server uses `vite.config.js` to prefer any certs found in `./certs/` (created by `setup-https`). If present, the browser will trust the origin and features that require secure contexts (reCAPTCHA, service workers) will work without warnings.

## Automated vs manual HTTPS setup

### Automated (recommended)

- Run `npm run setup-https` (Windows script uses Chocolatey + mkcert to create a local trusted CA and generate `certs/localhost.pem` and `certs/localhost-key.pem`).

### Manual

- Use `mkcert` directly:

```powershell
# install mkcert (one-time)
choco install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
# move/rename produced files into ./certs/ as localhost.pem and localhost-key.pem
```

- Or create a self-signed cert (browsers will warn unless you trust it):

```powershell
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout .\certs\localhost-key.pem -out .\certs\localhost.pem -days 365 -subj "/CN=localhost"
```

## Build & production notes

- Production build: `npm run build`.
- The build step runs `vite build` and then copies static assets into `dist/` so the output is a standalone static site ready for deployment.
- Copy behavior (why): the build script uses `shx` to copy `src/js` and `assets` into `dist/` to preserve non-bundled files that are referenced by the HTML in production. This is intentional for the current static hosting arrangement (Azure Static Web Apps). If you prefer, these files can be moved under `public/` so Vite copies them automatically.

Example (what `npm run build` does):

```text
vite build
npx shx mkdir -p dist/src && npx shx cp -r src/js dist/src/
npx shx mkdir -p dist/assets && npx shx cp -r assets/* dist/assets/
```

## CI / Deployment

- The repository uses a GitHub Actions workflow to deploy the `dist/` folder (Azure Static Web Apps or equivalent). The CI runner must run `npm ci` and `npm run build` to produce `dist/`.
- On Linux CI runners, `shx` is used to ensure cross-platform copy/mkdir behavior (so build scripts are platform independent).

## Troubleshooting

- If reCAPTCHA or other secure-context features fail locally, confirm your dev origin (e.g. `https://localhost:5173` or `https://localhost:3000`) is authorized in the reCAPTCHA console.
- If the browser still warns about HTTPS after running `npm run setup-https`, try restarting the browser or re-running `mkcert -install` with elevated privileges.
- If build artifacts are missing in `dist/`, ensure the build script completed successfully and that the `shx` copy step ran without errors.

## Notes for contributors

- The site's JS has been refactored into ES modules under `src/js/` and a single entrypoint `src/main.js` initializes components in a controlled order (translations first). Keep this in mind when adding new scripts—export an `init*()` function and import it from `src/main.js`.
Local development notes — HTTPS with Vite
=====================================

This file documents how to run the Vite dev server over HTTPS on Windows for testing features that require secure origins (reCAPTCHA, service workers, etc.).
## Automated Setup (Recommended)
Run this once to install mkcert and generate trusted certificates:
```bash
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
This will create cert files in the current directory like `localhost+2.pem` and `localhost+2-key.pem`. Move/rename them into the project `certs/` folder as `localhost.pem` and `localhost-key.pem`.

2) Alternative: OpenSSL (self-signed, browser will warn unless you trust it)

```powershell
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout .\certs\localhost-key.pem -out .\certs\localhost.pem -days 365 -subj "/CN=localhost"

3) Start the dev server (config in `vite.config.js` will use certs if present, otherwise Vite generates a self-signed cert):
```powershell
# start dev server (uses vite.config.js https setting)
npm run dev
```

4) Notes
Local development notes — HTTPS with Vite
=====================================

This file documents how to run the Vite dev server over HTTPS on Windows for testing features that require secure origins (reCAPTCHA, service workers, etc.).

## Automated Setup (Recommended)
Run this once to install mkcert and generate trusted certificates:
```bash
npm run setup-https
- `dist` is only needed for production builds (`npm run build`). Vite serves from memory while running `npm run dev` (HMR).
- If your site key for reCAPTCHA is origin-restricted, add the exact origin you use (e.g. `https://localhost:3000`) to the allowed origins in the reCAPTCHA console.
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