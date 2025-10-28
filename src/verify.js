const axios = require('axios');
const cfg = require('./config');
const { refs } = require('./pay');
const { nowMs } = require('./utils');
const { sendUnlock } = require('./ws');
async function verifyRoute(req, res) {
  const { txid, deviceId, reference } = req.body || {};
  if (!txid || !deviceId || !reference) return res.status(400).json({ ok: false, error: 'missing fields' });
  const ch = refs.get(reference);
  if (!ch || ch.deviceId !== deviceId) return res.status(404).json({ ok: false, error: 'unknown reference/device' });
  if (nowMs() - ch.created > ch.ttl * 1000) return res.status(408).json({ ok: false, error: 'reference expired' });
  try {
    const vr = await axios.post(cfg.verifierUrl, { txid, reference, amount: ch.amount, currency: ch.currency }, { timeout: 5000 });
    if (vr.data && vr.data.ok) {
      const delivered = sendUnlock(deviceId, { type: 'unlock', deviceId, ref: reference, txid });
      return res.json({ ok: true, delivered });
    }
    return res.status(409).json({ ok: false, error: 'verification failed', details: vr.data || null });
  } catch {
    return res.status(502).json({ ok: false, error: 'verifier unreachable' });
  }
}
module.exports = { verifyRoute };
