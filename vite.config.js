import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import fs from 'fs';
import path from 'path';

// Check for custom certs in ./certs; if present, use them; else use basicSsl plugin
const certDir = path.resolve(__dirname, 'certs');
let httpsConfig = basicSsl(); // default to basicSsl

try {
  const keyPath = path.join(certDir, 'localhost-key.pem');
  const certPath = path.join(certDir, 'localhost.pem');
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    console.log('Using trusted HTTPS certs from', certDir);
  } else {
    console.log('No custom certs found in', certDir, '- using basic-ssl plugin (self-signed)');
  }
} catch (err) {
  console.error('Error reading certs:', err);
  httpsConfig = basicSsl();
}

export default defineConfig({
  server: {
    host: true, // allow access from LAN if needed
    port: 3000,
    open: true,
    https: httpsConfig,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
