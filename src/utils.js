function randomHex(n = 32) { return [...Array(n)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''); }
function nowMs() { return Date.now(); }
module.exports = { randomHex, nowMs };
