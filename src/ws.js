const { WebSocketServer } = require('ws');
const sockets = new Map();
function attachWSS(server, wsPath = '/ws') {
  const wss = new WebSocketServer({ noServer: true });
  server.on('upgrade', (req, socket, head) => {
    if (!req.url.startsWith(wsPath)) return socket.destroy();
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  });
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://x');
    const deviceId = url.searchParams.get('deviceId') || 'UNKNOWN';
    if (!sockets.has(deviceId)) sockets.set(deviceId, new Set());
    sockets.get(deviceId).add(ws);
    ws.on('close', () => sockets.get(deviceId)?.delete(ws));
  });
  return wss;
}
function sendUnlock(deviceId, payload) {
  const set = sockets.get(deviceId);
  if (!set || set.size === 0) return 0;
  const msg = JSON.stringify(payload);
  let count = 0; set.forEach(ws => { try { ws.send(msg); count++; } catch(_){} });
  return count;
}
module.exports = { attachWSS, sendUnlock };
