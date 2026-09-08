<?php
/**
 * Plugin Name: Hansprint OS
 * Description: Websitebouwstenen, een startdashboard en een eigen WordPress-inlogstijl.
 * Version: 0.1.0
 * Requires at least: 6.6
 * Requires PHP: 8.0
 * Author: Hansprint
 * License: GPL-2.0-or-later
 * Text Domain: hansprint-os
 */
namespace HansprintOS;

defined('ABSPATH') || exit;

const VERSION = '0.1.0';
const OPTION = 'hansprint_os_brand';

require_once __DIR__ . '/includes/settings.php';
require_once __DIR__ . '/includes/blocks.php';
require_once __DIR__ . '/includes/admin.php';

function asset($path) {
    return plugins_url('assets/' . $path, __FILE__);
}

function brand_css($selector) {
    $s = settings();
    return $selector . '{--hp-primary:' . $s['primary'] . ';--hp-on-primary:' . contrast_color($s['primary']) . ';--hp-ink:#111827;--hp-surface:#f8fafc;}';
}

function enqueue_styles() {
    wp_enqueue_style('hansprint-os-blocks', asset('blocks.css'), array(), VERSION);
    wp_add_inline_style('hansprint-os-blocks', brand_css(':root'));
}
add_action('enqueue_block_assets', __NAMESPACE__ . '\\enqueue_styles');

function login_styles() {
    $s = settings();
    if (!$s['login_enabled']) {
        return;
    }
    wp_enqueue_style('hansprint-os-login', asset('login.css'), array(), VERSION);
    $css = brand_css('body.login');
    $css .= 'body.login{--hp-login-bg:' . $s['background'] . ';--hp-login-ink:' . contrast_color($s['background']) . ';}';
    $logo = wp_get_attachment_image_url($s['logo_id'], 'medium');
    if ($logo) {
        $css .= 'body.login #login h1 a{background-image:url(' . wp_json_encode(esc_url_raw($logo), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ');background-size:contain;width:100%;height:88px;}';
    }
    wp_add_inline_style('hansprint-os-login', $css);
}
add_action('login_enqueue_scripts', __NAMESPACE__ . '\\login_styles');
add_filter('login_headerurl', function ($url) {
    return settings()['login_enabled'] ? home_url('/') : $url;
});
add_filter('login_headertext', function ($text) {
    return settings()['login_enabled'] ? settings()['name'] : $text;
});
add_filter('login_message', function ($message) {
    $s = settings();
    return $s['login_enabled'] && $s['welcome'] !== ''
        ? '<p class="hp-login-welcome">' . esc_html($s['welcome']) . '</p>' . $message
        : $message;
});
