// LOCAL device-testing config only — serves the dev app over HTTPS (self-signed)
// so a phone on the same Wi-Fi can use the camera (getUserMedia needs a secure
// context). NOT for prod; not committed. Run:
//   $env:VITE_PPG_DEBUG='true'; npx vite --config vite.https.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  server: { host: true, port: 5001, strictPort: true },
});
