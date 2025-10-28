require('dotenv').config();
const cfg = {
  port: parseInt(process.env.PORT || '8080', 10),
  wsPath: process.env.WS_PATH || '/ws',
  verifierUrl: process.env.VERIFIER_URL || 'http://localhost:9090/verify',
  merchantSol: process.env.MERCHANT_SOL_ADDRESS || '',
  ttl: parseInt(process.env.CHALLENGE_TTL_SECONDS || '60', 10),
};
if (!cfg.merchantSol) console.warn('[config] MERCHANT_SOL_ADDRESS is empty — set it in .env for real usage.');
module.exports = cfg;
