import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:4173');
const resources = new Map([
  ['/', 'text/html'],
  ['/styles.css', 'text/css'],
  ['/app.js', 'text/javascript'],
  ['/data.js', 'text/javascript'],
  ['/assets/flow-ribbon.png', 'image/png'],
]);

for (const [path, mime] of resources) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} must load`);
  assert.ok(response.headers.get('content-type')?.includes(mime), `${path} must use ${mime}`);
  assert.ok((await response.arrayBuffer()).byteLength > 0, `${path} must not be empty`);
  console.log(`PASS ${path} returns ${mime}`);
}

const missing = await fetch(new URL('/missing-resource', base));
assert.equal(missing.status, 404, 'Missing resources return 404');
const mutation = await fetch(base, { method: 'POST' });
assert.equal(mutation.status, 405, 'The static server rejects write methods');
const privateFile = await fetch(new URL('/%2e%2e%2fpackage.json', base));
assert.equal(privateFile.status, 403, 'Files outside dist are not served');
console.log('PASS missing resources, read-only methods, and directory boundary');
