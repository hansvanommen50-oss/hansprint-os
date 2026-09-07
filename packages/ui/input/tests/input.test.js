import test from 'node:test';
import assert from 'node:assert/strict';
import { Input } from '../dist/Input.js';

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.disabled = false;
    this.type = '';
    this.value = '';
    this.placeholder = '';
    this.className = '';
    this.attributes = {};
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

class FakeDocument {
  createElement(tagName) {
    return new FakeElement(tagName);
  }
}

global.document = new FakeDocument();

test('inputs default to a text type and empty values', () => {
  const input = new Input();
  const rendered = input.render();

  assert.equal(rendered.type, 'text');
  assert.equal(rendered.value, '');
  assert.equal(rendered.placeholder, '');
});

test('inputs apply an aria-label when a label prop is provided', () => {
  const input = new Input({ label: 'Email address' });
  const rendered = input.render();

  assert.equal(rendered.attributes['aria-label'], 'Email address');
});
