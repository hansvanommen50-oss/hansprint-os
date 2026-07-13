import test from 'node:test';
import assert from 'node:assert/strict';
import { Button } from '../dist/Button.js';

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.disabled = false;
    this.textContent = '';
    this.className = '';
  }
}

class FakeDocument {
  createElement(tagName) {
    return new FakeElement(tagName);
  }
}

global.document = new FakeDocument();

test('loading buttons are disabled and show loading text', () => {
  const button = new Button({ label: 'Save', loading: true });
  const rendered = button.render();

  assert.equal(rendered.disabled, true);
  assert.equal(rendered.textContent, 'Laden...');
});
