import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const registered = new Map();
const element = (tag, props, ...children) => ({ tag, props, children });
vm.runInNewContext(readFileSync(new URL('../hansprint-os/assets/editor.js', import.meta.url), 'utf8'), {
  window: { wp: { element: { createElement: element }, blockEditor: {}, components: {}, blocks: { registerBlockType: (name, options) => registered.set(name, options) } } }
});
test('all three editor schemas match server block metadata', () => {
  assert.equal(registered.size, 3);
  for (const [name, options] of registered) {
    const type = name.split('/')[1];
    const metadata = JSON.parse(readFileSync(new URL(`../hansprint-os/blocks/${type}/block.json`, import.meta.url)));
    assert.equal(JSON.stringify(options.attributes), JSON.stringify(metadata.attributes));
  }
});
test('saved content remains readable and keeps safe contact links', () => {
  const saved = registered.get('hansprint/hero').save({ attributes: { heading: 'Welkom', text: 'Verhaal', label: 'Contact', url: '/contact/' } });
  assert.equal(saved.tag, 'section');
  assert.equal(saved.children[0].children[0], 'Welkom');
  assert.equal(saved.children[2].props.href, '/contact/');
});
test('dangerous schemes and control characters never enter saved links', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'java\nscript:alert(1)', ' JAVASCRIPT:alert(1)']) {
    const saved = registered.get('hansprint/cta').save({ attributes: { heading: 'Test', text: '', label: 'Click', url } });
    assert.equal(saved.children[2], null);
  }
});
