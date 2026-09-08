<?php
namespace HansprintOS;
defined('ABSPATH') || exit;

function defaults() {
    return array('name' => 'Hansprint', 'primary' => '#1f4fff', 'background' => '#f8fafc', 'logo_id' => 0, 'welcome' => 'Welkom. Bouw aan je website.', 'login_enabled' => false);
}

function sanitize_settings($input) {
    $input = is_array($input) ? $input : array();
    $out = defaults();
    foreach (array('name', 'welcome') as $key) {
        $out[$key] = isset($input[$key]) && is_string($input[$key]) ? sanitize_text_field($input[$key]) : $out[$key];
    }
    foreach (array('primary', 'background') as $key) {
        $out[$key] = isset($input[$key]) && is_string($input[$key]) ? (sanitize_hex_color($input[$key]) ?: $out[$key]) : $out[$key];
        if (strlen($out[$key]) === 4) {
            $hex = $out[$key];
            $out[$key] = '#' . $hex[1] . $hex[1] . $hex[2] . $hex[2] . $hex[3] . $hex[3];
        }
    }
    $id = isset($input['logo_id']) && is_scalar($input['logo_id']) ? absint($input['logo_id']) : 0;
    $out['logo_id'] = $id && in_array(get_post_mime_type($id), array('image/png', 'image/jpeg', 'image/webp', 'image/gif'), true) ? $id : 0;
    $out['login_enabled'] = isset($input['login_enabled']) && in_array($input['login_enabled'], array(true, 1, '1'), true);
    return $out;
}

function settings() {
    return sanitize_settings(get_option(OPTION, defaults()));
}

// WCAG relative luminance: choose the higher-contrast button/heading text.
function contrast_color($hex) {
    $hex = ltrim($hex, '#');
    if (strlen($hex) === 3) {
        $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
    }
    $rgb = array_map(function ($part) {
        $v = hexdec($part) / 255;
        return $v <= 0.04045 ? $v / 12.92 : pow(($v + 0.055) / 1.055, 2.4);
    }, str_split($hex, 2));
    $l = 0.2126 * $rgb[0] + 0.7152 * $rgb[1] + 0.0722 * $rgb[2];
    return ($l + 0.05) / 0.05 >= 1.05 / ($l + 0.05) ? '#000000' : '#ffffff';
}

add_action('admin_init', function () {
    register_setting('hansprint_os', OPTION, array('type' => 'array', 'sanitize_callback' => __NAMESPACE__ . '\\sanitize_settings', 'default' => defaults()));
});
