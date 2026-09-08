(function (wp) {
  const el = wp.element.createElement;
  const { InspectorControls, useBlockProps } = wp.blockEditor;
  const { PanelBody, TextControl, TextareaControl } = wp.components;
  const attributes = {
    heading: { type: 'string', default: 'Jouw verhaal begint hier' },
    text: { type: 'string', default: 'Vertel wat je doet en voor wie.' },
    label: { type: 'string', default: '' },
    url: { type: 'string', default: '' },
    anchor: { type: 'string', default: '' }
  };
  // Match PHP escaping: only links with safe web/contact protocols or relative paths.
  function safeUrl(value) {
    if (!value || Array.from(value).some((character) => character.charCodeAt(0) <= 32)) return '';
    return /^[a-z][a-z\d+.-]*:/i.test(value) && !/^(https?:|mailto:|tel:)/i.test(value) ? '' : value;
  }
  [['hero', 'Hansprint Hero', 'cover-image'], ['card', 'Hansprint Kaart', 'index-card'], ['cta', 'Hansprint Contactblok', 'megaphone']].forEach(([type, title, icon]) => {
    wp.blocks.registerBlockType('hansprint/' + type, {
      apiVersion: 3, title, icon, category: 'hansprint', attributes,
      supports: { html: false },
      edit({ attributes: attrs, setAttributes }) {
        const control = (key, label, component = TextControl) => el(component, { key, label, value: attrs[key], onChange: (value) => setAttributes({ [key]: value }) });
        return el(wp.element.Fragment, null,
          el(InspectorControls, null, el(PanelBody, { title: 'Inhoud en link' },
            control('heading', 'Titel'), control('text', 'Beschrijving', TextareaControl),
            control('label', 'Knoptekst'), control('url', 'Link (bijv. /contact/)'), control('anchor', 'Anker (bijv. aanbod)'),
            el('p', null, 'Een knop verschijnt zodra tekst én een geldige link zijn ingevuld.'))),
          el('section', useBlockProps({ className: 'hp-section hp-' + type }), el('div', { className: 'hp-section-inner' },
            el('h2', null, attrs.heading), el('p', { style: { whiteSpace: 'pre-line' } }, attrs.text),
            attrs.label && safeUrl(attrs.url) ? el('span', { className: 'hp-button' }, attrs.label) : null)));
      },
      // Human-readable saved content remains available if Hansprint OS is deactivated.
      save({ attributes: attrs }) {
        return el('section', null, el('h2', null, attrs.heading), el('p', null, attrs.text),
          attrs.label && safeUrl(attrs.url) ? el('a', { href: safeUrl(attrs.url) }, attrs.label) : null);
      }
    });
  });
}(window.wp));
