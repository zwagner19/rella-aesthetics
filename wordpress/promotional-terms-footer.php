<?php
// WPCode PHP snippet: Promotional Terms link for the five legacy Napa footers.
// Auto Insert: Run Everywhere. No styles, scripts, or booking changes.
$rella_promotional_footer = static function ($content) {
    if (is_admin() || !is_page(array(1203, 1204, 1205, 1206, 1207)) || !is_string($content)) {
        return $content;
    }
    return preg_replace_callback('~<footer\b[^>]*>.*?</footer>~is', static function ($match) {
        $footer = $match[0];
        if (strpos($footer, 'experiencerella.com/promotional-terms') !== false) {
            return $footer;
        }
        $privacy = '<a href="https://experiencerella.com/privacy-policy/">Privacy</a>';
        $terms = ' · <a href="https://experiencerella.com/promotional-terms">Promotional Terms &amp; Conditions</a>';
        return str_replace($privacy, $privacy . $terms, $footer);
    }, $content);
};
add_filter('the_content', $rella_promotional_footer, 99);
add_filter('elementor/frontend/the_content', $rella_promotional_footer, 99);
