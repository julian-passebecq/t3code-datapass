import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

const probe = net.createServer();
await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const child = spawn(process.execPath, ['apps/server/dist/bin.mjs', '--host', '127.0.0.1', '--port', String(port),
  '--base-dir', path.resolve('.datapass/smoke-home'), '--no-browser'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
// Startup may emit one-time pairing credentials. Consume and discard; never log them.
child.stdout.on('data', () => {}); child.stderr.on('data', () => {});
let exitCode;
child.on('exit', code => { exitCode = code; });
const deadline = Date.now() + 25000;
let response;
try {
  while (Date.now() < deadline && exitCode === undefined) {
    try { response = await fetch(`http://127.0.0.1:${port}/datapass`, { signal: AbortSignal.timeout(1500) }); if (response.ok) break; }
    catch { /* Server is still starting. */ }
    await new Promise(resolve => setTimeout(resolve, 400));
  }
  if (!response?.ok) throw new Error('HTTP smoke failed');
  const html = await response.text();
  const index = await fs.readFile('apps/web/dist/index.html', 'utf8');
  console.log(JSON.stringify({ serverStarted: true, httpStatus: response.status, spaShellServed: html.includes('<html') && html.includes('<script'), buildShellMatches: html === index }));
} catch {
  console.log(JSON.stringify({ serverStarted: false, exitCode: exitCode ?? null })); process.exitCode = 1;
} finally {
  // This is the exact child created above, never a process found by name or pattern.
  child.kill();
  await new Promise(resolve => { if (exitCode !== undefined) resolve(); else child.once('exit', resolve); });
}
