(function () {
  const form = document.getElementById('hp-brand-form');
  if (!form) return;
  const field = (name) => document.getElementById('hp-' + name);
  function contrast(hex) {
    const rgb = hex.slice(1).match(/.{2}/g).map((part) => {
      const value = parseInt(part, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#000000' : '#ffffff';
  }
  function update() {
    field('preview').style.backgroundColor = field('background').value;
    const button = form.closest('.hp-admin-grid').querySelector('.hp-preview-button');
    button.style.backgroundColor = field('primary').value;
    button.style.color = contrast(field('primary').value);
    field('preview-name').textContent = field('name').value;
    field('preview-welcome').textContent = field('welcome').value;
  }
  form.addEventListener('input', update);
  field('remove-logo').addEventListener('click', () => {
    field('logo').value = '0';
    field('preview-logo').hidden = true;
    field('preview-logo').removeAttribute('src');
  });
  field('select-logo').addEventListener('click', () => {
    const picker = window.wp.media({ title: 'Kies je merklogo', library: { type: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] }, multiple: false });
    picker.on('select', () => {
      const attachment = picker.state().get('selection').first().toJSON();
      field('logo').value = attachment.id;
      field('preview-logo').src = attachment.url;
      field('preview-logo').hidden = false;
    });
    picker.open();
  });
  update();
}());
