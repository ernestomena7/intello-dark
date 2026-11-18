// One JSON line per event on stdout. Never pass visitor data (names, emails, phones, companies, message text) or secrets.
let level = 'info';
export function setLogLevel(value) { level = value; }

export function log(event, fields = {}) {
  if (event === 'debug' && level !== 'debug') return;
  process.stdout.write(JSON.stringify({ time: new Date().toISOString(), event, ...fields }) + '\n');
}
