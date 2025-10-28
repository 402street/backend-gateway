# 402Street — Backend Gateway (x402)

Gateway issues **HTTP 402** payment challenges and emits **unlock** events to devices over WebSocket.

## Endpoints
- `GET /pay/:deviceId?amount=0.25&currency=USDC|402ST` → **402 Payment Required** with `X-Payment-Request` header (payload mirrored in body)
- `POST /verify` → `{ "ok": true, "delivered": <count> }` on success
- WebSocket: `/ws?deviceId=DEVICE_1` → `{ "type":"unlock", "deviceId":"DEVICE_1", "ref":"<ref>", "txid":"<txid>" }`

## Quick start
```bash
cp .env.example .env
# set MERCHANT_SOL_ADDRESS
npm i
npm start
