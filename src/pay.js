const cfg = require('./config');
const { randomHex, nowMs } = require('./utils');
const refs = new Map();
setInterval(() => {
  const t = nowMs();
  for (const [ref, ch] of refs.entries()) if (t - ch.created > (ch.ttl * 1000)) refs.delete(ref);
}, 10_000);
function payRoute(req, res) {
  const deviceId = req.params.deviceId;
  const amount = parseFloat(req.query.amount || '0.25');
  const currency = String(req.query.currency || 'USDC').toUpperCase();
  const recipient = cfg.merchantSol;
  const reference = randomHex(32);
  const ttl = cfg.ttl;
  refs.set(reference, { deviceId, amount, currency, created: nowMs(), ttl });
  const payment = { amount, currency, recipient, reference, ttl };
  res.set('X-Payment-Request', JSON.stringify(payment));
  res.status(402).json({ ok: false, message: 'Payment Required (x402)', payment });
}
module.exports = { payRoute, refs };
