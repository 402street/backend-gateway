const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cfg = require('./config');
const { attachWSS } = require('./ws');
const { payRoute } = require('./pay');
const { verifyRoute } = require('./verify');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/pay/:deviceId', payRoute);
app.post('/verify', verifyRoute);

const server = app.listen(cfg.port, () => console.log(`[gateway] listening on :${cfg.port}`));
attachWSS(server, cfg.wsPath);
