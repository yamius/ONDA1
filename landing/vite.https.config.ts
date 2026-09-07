// LOCAL device-testing config only — NOT committed (local-only dev cert).
// Serves the landing dev server over HTTPS (self-signed) bound to the LAN, so a
// phone on the same Wi-Fi can open /emoton and use the camera — getUserMedia
// needs a secure context, which plain http://<lan-ip> is not.
//
//   cd landing && npx vite --config vite.https.config.ts --host --port 5181
//
// On the phone: open https://<this-machine-lan-ip>:5181/emoton and accept the
// self-signed certificate warning (Advanced → Proceed) once.
import { mergeConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import base from './vite.config'

export default mergeConfig(base, {
  plugins: [basicSsl()],
  server: { host: true },
})
