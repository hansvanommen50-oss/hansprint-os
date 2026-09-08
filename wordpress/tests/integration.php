<?php
// Runs against an actual isolated WordPress installation, not WordPress stubs.
function hp_assert($condition, $message) {
    if (!$condition) {
        throw new Exception('HANSPRINT TEST FAILED: ' . $message);
    }
}
foreach (array('hero', 'card', 'cta') as $type) {
    hp_assert(WP_Block_Type_Registry::get_instance()->is_registered('hansprint/' . $type), 'Block registered: ' . $type);
}
$clean = \HansprintOS\sanitize_settings(array('name' => '<script>alert(1)</script>Merk', 'primary' => 'red;}</style><script>x</script>', 'background' => array(), 'logo_id' => 999999, 'login_enabled' => array('1'), 'welcome' => '<b>Welkom</b>'));
hp_assert($clean['primary'] === '#1f4fff', 'Invalid color rejected');
hp_assert($clean['background'] === '#f8fafc', 'Array input rejected');
hp_assert($clean['logo_id'] === 0 && $clean['login_enabled'] === false, 'Invalid logo and checkbox rejected');
hp_assert(strpos($clean['name'], '<') === false && $clean['welcome'] === 'Welkom', 'Text sanitized');
hp_assert(\HansprintOS\contrast_color('#fff') === '#000000', 'White contrast');
hp_assert(\HansprintOS\contrast_color('#000000') === '#ffffff', 'Black contrast');
hp_assert(\HansprintOS\sanitize_settings(array('primary' => '#abc'))['primary'] === '#aabbcc', 'Short colors normalized for browser color inputs');

wp_set_current_user(0);
hp_assert(is_wp_error(\HansprintOS\create_draft('hansprint')), 'Anonymous cannot create');
$user = wp_insert_user(array('user_login' => 'hp-subscriber', 'user_pass' => wp_generate_password(), 'role' => 'subscriber'));
wp_set_current_user($user);
hp_assert(is_wp_error(\HansprintOS\create_draft('hansprint')), 'Subscriber cannot create');
wp_set_current_user(1);
hp_assert(is_wp_error(\HansprintOS\create_draft('unknown')), 'Invalid profile rejected');
$front = get_option('page_on_front');
foreach (array_keys(\HansprintOS\profiles()) as $profile) {
    $id = \HansprintOS\create_draft($profile);
    hp_assert(!is_wp_error($id) && get_post_status($id) === 'draft', 'Creates draft: ' . $profile);
    $content = get_post_field('post_content', $id);
    hp_assert(count(array_filter(parse_blocks($content), function ($b) { return !empty($b['blockName']); })) === 3, 'Three page blocks');
    $html = do_blocks($content);
    hp_assert(strpos($html, 'hp-hero') !== false && strpos($html, 'id="aanbod"') !== false, 'Rendered hero and anchor');
}
hp_assert(get_option('page_on_front') === $front, 'Existing homepage unchanged');
$block = '<!-- wp:hansprint/cta {"heading":"<script>alert(1)</script>","url":"javascript:alert(1)","label":"Click"} --><section>Fallback</section><!-- /wp:hansprint/cta -->';
$html = do_blocks($block);
hp_assert(strpos($html, '<script>') === false && strpos($html, 'javascript:') === false, 'Rendered content escaped');

update_option(\HansprintOS\OPTION, \HansprintOS\defaults());
\HansprintOS\login_styles();
hp_assert(!wp_style_is('hansprint-os-login', 'enqueued'), 'Login opt-in default');
hp_assert(apply_filters('login_message', 'Original') === 'Original', 'Original login message preserved');
update_option(\HansprintOS\OPTION, array_merge(\HansprintOS\defaults(), array('login_enabled' => true, 'welcome' => '<script>bad</script>Welkom')));
\HansprintOS\login_styles();
hp_assert(wp_style_is('hansprint-os-login', 'enqueued'), 'Custom login stylesheet');
hp_assert(strpos(apply_filters('login_message', 'Original'), '<script>') === false, 'Login welcome escaped');
hp_assert(strpos(apply_filters('login_message', 'Original'), 'Original') !== false, 'Core login messages retained');
hp_assert(apply_filters('login_headerurl', 'https://wordpress.org/') === home_url('/'), 'Logo points to site');
echo "HANSPRINT WORDPRESS INTEGRATION: PASS\n";
