<?php
namespace HansprintOS;
defined('ABSPATH') || exit;

add_action('admin_menu', function () {
    add_menu_page('Hansprint OS', 'Hansprint OS', 'manage_options', 'hansprint-os', __NAMESPACE__ . '\\admin_page', 'dashicons-layout', 3);
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_hansprint-os') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_style('hansprint-os-admin', asset('admin.css'), array(), VERSION);
    wp_enqueue_script('hansprint-os-admin', asset('admin.js'), array('media-views'), VERSION, true);
});

add_action('wp_dashboard_setup', function () {
    if (current_user_can('edit_pages')) {
        wp_add_dashboard_widget('hansprint_os_start', 'Jouw website bouwen', function () {
            echo '<p>Welkom bij ' . esc_html(settings()['name']) . '. Bouw pagina’s met Hansprint-blokken en startpatronen.</p>';
            echo '<p><a href="' . esc_url(admin_url('edit.php?post_type=page')) . '">Pagina’s beheren</a></p>';
            if (current_user_can('manage_options')) {
                echo '<p><a href="' . esc_url(admin_url('admin.php?page=hansprint-os')) . '">Hansprint dashboard en huisstijl</a></p>';
            }
        });
    }
});

function create_draft($profile) {
    if (!current_user_can('edit_pages') || !current_user_can('manage_options')) {
        return new \WP_Error('forbidden', 'Je hebt geen toegang tot deze actie.');
    }
    if (!is_string($profile) || !isset(profiles()[$profile])) {
        return new \WP_Error('invalid_profile', 'Onbekend startpatroon.');
    }
    return wp_insert_post(array('post_type' => 'page', 'post_status' => 'draft', 'post_title' => profiles()[$profile]['name'] . ' — startpagina', 'post_content' => starter_content($profile)), true);
}

add_action('admin_post_hansprint_os_create', function () {
    if (!current_user_can('manage_options') || !current_user_can('edit_pages')) {
        wp_die('Geen toegang.', '', array('response' => 403));
    }
    check_admin_referer('hansprint_os_create');
    $key = isset($_POST['profile']) && is_string($_POST['profile']) ? sanitize_key(wp_unslash($_POST['profile'])) : '';
    $id = create_draft($key);
    if (is_wp_error($id)) {
        wp_die(esc_html($id->get_error_message()));
    }
    wp_safe_redirect(admin_url('post.php?post=' . absint($id) . '&action=edit'));
    exit;
});

function admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $s = settings();
    ?>
    <div class="wrap hp-admin">
        <header class="hp-admin-header"><span class="hp-eyebrow">HANSPRINT OS · WEBSITE STUDIO</span><h1>Jouw website. Jouw stijl.</h1><p>Bouw een pagina, stel je huisstijl in en geef je inlogpagina een eigen gezicht.</p></header>
        <?php settings_errors(); ?>
        <div class="hp-admin-grid">
            <section class="hp-panel">
                <h2>01 / Begin met een pagina</h2>
                <p>Kies een startpatroon. We maken een nieuw concept; je bestaande homepage blijft staan.</p>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <input type="hidden" name="action" value="hansprint_os_create">
                    <?php wp_nonce_field('hansprint_os_create'); ?>
                    <label for="hp-profile">Website / merk</label>
                    <select id="hp-profile" name="profile">
                        <?php foreach (profiles() as $key => $profile) : ?>
                            <option value="<?php echo esc_attr($key); ?>"><?php echo esc_html($profile['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <?php submit_button('Maak een conceptpagina', 'primary', 'submit', false); ?>
                </form>
                <p class="description">Voorbeeldteksten zijn bedoeld om te vervangen. Pas de contactknop aan voor publicatie.</p>
                <p><a href="<?php echo esc_url(admin_url('edit.php?post_type=page')); ?>">Alle pagina’s bekijken →</a></p>
                <p><a href="<?php echo esc_url(admin_url('options-reading.php')); ?>">Een gepubliceerde pagina als homepage instellen →</a></p>
                <hr><h3>Zo bouw je verder</h3><ol><li>Open een pagina in de blokeditor.</li><li>Klik op + en zoek naar Hansprint.</li><li>Voeg een Hero, Kaart of Contactblok toe.</li><li>Pas teksten en links aan in de zijbalk.</li><li>Bekijk het voorbeeld en publiceer als je tevreden bent.</li></ol>
            </section>
            <section class="hp-panel">
                <h2>02 / Huisstijl &amp; inloggen</h2>
                <p>Deze instellingen gelden alleen voor deze WordPress-website. Je thema houdt zijn eigen navigatie en layout.</p>
                <form method="post" action="options.php" id="hp-brand-form">
                    <?php settings_fields('hansprint_os'); ?>
                    <label for="hp-name">Merknaam</label>
                    <input id="hp-name" name="hansprint_os_brand[name]" type="text" value="<?php echo esc_attr($s['name']); ?>" maxlength="120">
                    <label for="hp-primary">Merkkleur (blokken en inlogknop)</label>
                    <input id="hp-primary" name="hansprint_os_brand[primary]" type="color" value="<?php echo esc_attr($s['primary']); ?>">
                    <label for="hp-background">Achtergrond inlogpagina</label>
                    <input id="hp-background" name="hansprint_os_brand[background]" type="color" value="<?php echo esc_attr($s['background']); ?>">
                    <label for="hp-logo">Logo voor de inlogpagina</label>
                    <input id="hp-logo" name="hansprint_os_brand[logo_id]" type="hidden" value="<?php echo esc_attr($s['logo_id']); ?>">
                    <div class="hp-logo-controls"><button class="button" type="button" id="hp-select-logo">Kies logo uit mediabibliotheek</button> <button class="button" type="button" id="hp-remove-logo">Gebruik WordPress-logo</button></div>
                    <p class="description">Gebruik PNG, JPG, WebP of GIF. Upload het logo via de mediabibliotheek.</p>
                    <label for="hp-welcome">Welkomsttekst</label>
                    <input id="hp-welcome" name="hansprint_os_brand[welcome]" type="text" value="<?php echo esc_attr($s['welcome']); ?>" maxlength="200">
                    <label class="hp-checkbox"><input name="hansprint_os_brand[login_enabled]" type="checkbox" value="1" <?php checked($s['login_enabled']); ?>> Eigen inlogstijl inschakelen</label>
                    <p class="description">Uitschakelen herstelt de standaard inlogstijl. Wachtwoordherstel en beveiligingsplugins blijven werken.</p>
                    <?php submit_button('Huisstijl opslaan'); ?>
                </form>
            </section>
            <section class="hp-panel hp-preview-panel"><h2>Voorbeeld inlogstijl</h2><p>Een stijlvoorbeeld, geen inlogformulier. Sla je instellingen op om ze toe te passen.</p>
                <div class="hp-login-preview" id="hp-preview"><div class="hp-preview-card">
                    <?php $logo = wp_get_attachment_image_url($s['logo_id'], 'medium'); ?>
                    <img id="hp-preview-logo" alt="Geselecteerd merklogo" <?php if ($logo) { echo 'src="' . esc_url($logo) . '"'; } else { echo 'hidden'; } ?>>
                    <strong id="hp-preview-name"><?php echo esc_html($s['name']); ?></strong><p id="hp-preview-welcome"><?php echo esc_html($s['welcome']); ?></p>
                    <span class="hp-preview-label">Gebruikersnaam of e-mailadres</span><div class="hp-preview-input" aria-hidden="true"></div>
                    <span class="hp-preview-label">Wachtwoord</span><div class="hp-preview-input" aria-hidden="true">••••••••</div>
                    <span class="hp-preview-button">Inloggen</span>
                </div></div>
                <p><a href="<?php echo esc_url(wp_login_url()); ?>" target="_blank" rel="noopener">Open de opgeslagen inlogpagina ↗</a></p>
            </section>
        </div>
    </div>
    <?php
}
