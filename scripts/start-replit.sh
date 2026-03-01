#!/bin/bash
# Start app (port 5000) + landing with Telegram bot (port 5001) in parallel
set -e
npm install
(cd landing && npm install)
npm run dev &
APP_PID=$!
PORT=5001 node landing/server.js &
LANDING_PID=$!
wait $APP_PID $LANDING_PID
