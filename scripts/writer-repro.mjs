import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createEntry, updateEntry, parseSnapshot, parseWriterSession } from '../dist/entry-model.js';

const repo = fileURLToPath(new URL('../', import.meta.url));
const revision = process.argv[2];
const source = revision
  ? execFileSync('git', ['show', `${revision}:dist/app.js`], { cwd: repo, encoding: 'utf8' })
  : fs.readFileSync(`${repo}/dist/app.js`, 'utf8');
const section = (start, end) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Actual app source section must exist: ${start}`);
  return source.slice(from, to);
};

function harness() {
  const fields = ['kind', 'title', 'date', 'category', 'tags', 'body'];
  const initial = { kind: 'log', title: '', date: '2026-10-23', category: '灵感', tags: '', body: 'Draft A' };
  const stored = new Map();
  const submit = { disabled: false };
  let discard;
  const c = {
    createEntry, updateEntry, parseSnapshot, console, structuredClone,
    draftKey: 'flow-writer-draft-v1', storageKey: 'flow-journal-v1', writeLock: 'flow-journal-v1-write',
    writerSession: { mode: 'create', touched: true, draft: { ...initial } },
    draftProblem: '', draftIssue: '', saving: false, storageError: '', userEntries: [],
    form: {
      elements: Object.fromEntries(fields.map(k => [k, { value: initial[k], disabled: false }])),
      querySelector: () => submit,
      reset() { for (const k of fields) this.elements[k].value = ''; },
    },
    formMessage: { textContent: '' }, saveAsNewButton: { disabled: false },
    discardDraftButton: { disabled: false, addEventListener: (_, fn) => { discard = fn; } },
    sessionStorage: {
      setItem(k, v) { if (c.failSet) throw new Error('QuotaExceededError'); stored.set(k, v); },
      getItem: k => stored.get(k) ?? null,
      removeItem(k) { if (c.failRemove) throw new Error('SecurityError'); stored.delete(k); },
    },
    localStorage: {
      getItem: k => stored.get(k) ?? null,
      setItem(k, v) { if (c.failWrite) throw new Error('QuotaExceededError'); stored.set(k, v); },
    },
    navigator: { locks: { request: (_, fn) => new Promise((resolve, reject) => {
      c.release = () => { try { resolve(fn()); } catch (error) { reject(error); } };
    }) } },
    crypto: { randomUUID: () => '00000000-0000-0000-0000-000000000099' },
    writeDialog: {
      close() {}, setAttribute() {}, removeAttribute() {}, addEventListener() {},
      querySelectorAll() { return [submit, c.saveAsNewButton, c.discardDraftButton, ...Object.values(c.form.elements)]; },
    },
    syncWriter() {}, announce(m) { c.announcement = m; }, entryHref: e => '#/entry/' + e.id,
    location: { hash: '#/flow' }, render() {}, route: () => ({ name: 'journal' }),
    currentLocalDate: () => initial.date,
    showWriter() { for (const k of fields) c.form.elements[k].value = c.writerSession.draft[k]; },
  };
  vm.createContext(c);
  vm.runInContext(
    section('const draftFields =', 'function showWriter(') +
    section('function openWriter()', 'function openEdit(') +
    section('function saveError(', 'function exportEntries(') +
    section('discardDraftButton.addEventListener(', 'saveAsNewButton.addEventListener('), c,
  );
  return { c, stored, discard: () => discard() };
}

const q = harness();
vm.runInContext('persistDraft()', q.c);
q.c.form.elements.body.value = 'Newer draft after quota filled';
q.c.failSet = true;
vm.runInContext('persistDraft()', q.c);
q.discard();
const quotaResult = {
  announced: q.c.announcement,
  recovered: parseWriterSession(q.stored.get(q.c.draftKey) ?? null)?.draft.body ?? null,
  draftIssue: q.c.draftIssue,
};
console.log('QUOTA_DISCARD', JSON.stringify(quotaResult));
if (!revision) {
  assert.equal(quotaResult.recovered, null, 'Discard must remove an older draft after quota failure');
  assert.equal(quotaResult.draftIssue, '', 'Successful removal clears the draft issue');
}

const r = harness();
const pending = vm.runInContext('saveEntry({preventDefault(){}})', r.c);
if (!revision) {
  assert.ok(r.c.writeDialog.querySelectorAll().every(control => control.disabled), 'All writer controls freeze while queued');
}
r.discard();
if (!revision) assert.ok(r.c.writerSession, 'Discard cannot replace a pending submission');
vm.runInContext('openWriter()', r.c);
r.c.form.elements.body.value = 'Draft B which user never submitted';
vm.runInContext('persistDraft()', r.c);
r.c.release();
await pending;
const queuedResult = {
  saved: parseSnapshot(r.stored.get(r.c.storageKey)).entries.map(e => e.body),
  writerSession: r.c.writerSession,
  announcement: r.c.announcement,
};
console.log('QUEUED_SAVE', JSON.stringify(queuedResult));
if (!revision) {
  assert.deepEqual(queuedResult.saved, ['Draft A'], 'A pending save must persist only the submitted draft');
  assert.equal(r.c.discardDraftButton.disabled, false, 'Controls are restored after commit');
}

const refused = harness();
vm.runInContext('persistDraft()', refused.c);
refused.c.failRemove = true;
refused.discard();
if (!revision) {
  assert.equal(parseWriterSession(refused.stored.get(refused.c.draftKey)).draft.body, 'Draft A');
  assert.ok(refused.c.writerSession, 'A failed removal keeps the draft in memory');
  assert.equal(refused.c.announcement, undefined, 'A failed removal cannot announce success');
}
console.log('REMOVE_REFUSED', refused.c.formMessage.textContent);

if (!revision) {
  const memory = harness();
  vm.runInContext('persistDraft()', memory.c);
  memory.c.failSet = true;
  memory.c.form.elements.body.value = 'Still in memory after draft storage fails';
  vm.runInContext('persistDraft(); openWriter()', memory.c);
  assert.equal(memory.c.form.elements.body.value, 'Still in memory after draft storage fails');

  const unsupported = harness();
  unsupported.c.navigator = {};
  await vm.runInContext('saveEntry({preventDefault(){}})', unsupported.c);
  assert.equal(unsupported.stored.has(unsupported.c.storageKey), false);
  assert.equal(unsupported.c.form.elements.body.value, 'Draft A');

  const denied = harness();
  denied.c.failWrite = true;
  const failure = vm.runInContext('saveEntry({preventDefault(){}})', denied.c);
  denied.c.release();
  await failure;
  assert.ok(denied.c.writerSession);
  assert.equal(denied.c.form.elements.body.value, 'Draft A');
  assert.equal(denied.stored.has(denied.c.storageKey), false);
  console.log('ERROR_PATHS draft-memory, unavailable-locks, and refused-write preserve input');
}
