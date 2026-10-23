import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.mp3':'audio/mpeg', '.wav':'audio/wav' };
const port = Number(process.env.PORT || 3000);
http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const location = path.resolve(root, '.' + urlPath, urlPath.endsWith('/') ? 'index.html' : '');
    if (!location.startsWith(root + path.sep) && location !== path.join(root, 'index.html')) { res.writeHead(403).end('Forbidden'); return; }
    if (!(await stat(location)).isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(location)] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(await readFile(location));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Ezra Be Hooping → http://localhost:${port}`));
