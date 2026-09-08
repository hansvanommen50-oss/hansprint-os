<?php
namespace HansprintOS;
defined('ABSPATH') || exit;

function profiles() {
    return array(
        'hansprint' => array('name' => 'Hansprint', 'title' => 'Een sterk merk begint met een helder verhaal.', 'text' => 'Vertel hier wat je maakt, voor wie en waarom het ertoe doet.', 'card' => 'Wat we voor je kunnen betekenen', 'cta' => 'Samen iets moois maken?'),
        'taalcentrumduits' => array('name' => 'Taalcentrum Duits', 'title' => 'Met vertrouwen Duits spreken.', 'text' => 'Beschrijf hier jouw taallessen, aanpak en doelgroep.', 'card' => 'Duits leren op jouw niveau', 'cta' => 'Welke cursus past bij jou?'),
        'bijkerk' => array('name' => 'Bijkerk Exclusive Cars', 'title' => 'Een auto die bij je past.', 'text' => 'Presenteer hier jouw aanbod en persoonlijke begeleiding.', 'card' => 'Ontdek ons aanbod', 'cta' => 'Maak een afspraak'),
        'client' => array('name' => 'Nieuwe klant', 'title' => 'Jouw verhaal, helder in beeld.', 'text' => 'Vervang deze voorbeeldtekst door de belofte van je klant.', 'card' => 'Onze dienstverlening', 'cta' => 'Laten we kennismaken')
    );
}

function starter_content($key) {
    $p = profiles()[$key] ?? profiles()['client'];
    $items = array(
        array('hero', $p['title'], $p['text'], 'Meer informatie', '#aanbod'),
        array('card', $p['card'], 'Voeg hier je eigen diensten, voorbeelden en bewijs toe.', '', ''),
        array('cta', $p['cta'], 'Voeg je contactgegevens toe en verbind de knop met je contactpagina.', 'Neem contact op', '')
    );
    $content = '';
    foreach ($items as $item) {
        list($type, $title, $text, $label, $url) = $item;
        $attrs = array('heading' => $title, 'text' => $text, 'label' => $label, 'url' => $url, 'anchor' => $type === 'card' ? 'aanbod' : '');
        // Dynamic rendering, with readable fallback content when the plugin is disabled.
        $fallback = '<section><h2>' . esc_html($title) . '</h2><p>' . esc_html($text) . '</p>';
        if ($label && $url) {
            $fallback .= '<a href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
        }
        $fallback .= '</section>';
        $content .= serialize_block(array('blockName' => 'hansprint/' . $type, 'attrs' => $attrs, 'innerBlocks' => array(), 'innerHTML' => $fallback, 'innerContent' => array($fallback))) . "\n";
    }
    return $content;
}

function render_section($attrs, $content, $block) {
    $type = str_replace('hansprint/', '', $block->name);
    $wrapper = get_block_wrapper_attributes(array('class' => 'hp-section hp-' . sanitize_html_class($type)));
    $heading = isset($attrs['heading']) && is_string($attrs['heading']) ? $attrs['heading'] : '';
    $text = isset($attrs['text']) && is_string($attrs['text']) ? $attrs['text'] : '';
    $url = isset($attrs['url']) && is_string($attrs['url']) ? esc_url($attrs['url']) : '';
    $label = isset($attrs['label']) && is_string($attrs['label']) ? $attrs['label'] : '';
    $anchor = isset($attrs['anchor']) && is_string($attrs['anchor']) ? sanitize_title($attrs['anchor']) : '';
    $html = '<section ' . $wrapper . ($anchor ? ' id="' . esc_attr($anchor) . '"' : '') . '><div class="hp-section-inner">';
    $html .= '<h2>' . esc_html($heading) . '</h2><p>' . nl2br(esc_html($text)) . '</p>';
    if ($url && $label) {
        $html .= '<a class="hp-button" href="' . $url . '">' . esc_html($label) . '</a>';
    }
    return $html . '</div></section>';
}

add_action('init', function () {
    wp_register_script('hansprint-os-editor', asset('editor.js'), array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'), VERSION, true);
    wp_register_style('hansprint-os-blocks', asset('blocks.css'), array(), VERSION);
    foreach (array('hero', 'card', 'cta') as $type) {
        register_block_type(dirname(__DIR__) . '/blocks/' . $type, array('render_callback' => __NAMESPACE__ . '\\render_section'));
    }
    register_block_pattern_category('hansprint', array('label' => 'Hansprint startpagina’s'));
    foreach (profiles() as $key => $profile) {
        register_block_pattern('hansprint/' . $key, array('title' => $profile['name'] . ' — startpagina', 'categories' => array('hansprint'), 'content' => starter_content($key)));
    }
});

add_filter('block_categories_all', function ($categories) {
    $categories[] = array('slug' => 'hansprint', 'title' => 'Hansprint');
    return $categories;
});
