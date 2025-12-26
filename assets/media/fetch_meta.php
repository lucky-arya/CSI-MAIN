<?php
// assets/media/fetch_meta.php
header('Content-Type: application/json; charset=utf-8');

$url = isset($_GET['url']) ? trim($_GET['url']) : '';
if (!$url) {
    echo json_encode(['ok' => false, 'error' => 'missing_url']);
    exit;
}
if (!preg_match('#^https?://#i', $url)) {
    echo json_encode(['ok' => false, 'error' => 'invalid_scheme']);
    exit;
}

$host = parse_url($url, PHP_URL_HOST);
if (!$host) {
    echo json_encode(['ok' => false, 'error' => 'invalid_url']);
    exit;
}

// ---- SSRF protection ----
$ip = gethostbyname($host);
$blocked = [
    '/^10\./', '/^127\./', '/^169\.254\./',
    '/^172\.(1[6-9]|2[0-9]|3[0-1])\./',
    '/^192\.168\./', '/^::1$/'
];
foreach ($blocked as $pat) {
    if (preg_match($pat, $ip)) {
        echo json_encode(['ok' => false, 'error' => 'blocked_private_ip']);
        exit;
    }
}

// ---- Cache ----
$cacheDir = __DIR__ . '/cache/';
if (!is_dir($cacheDir)) mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . md5($url) . '.json';

if (file_exists($cacheFile) && time() - filemtime($cacheFile) < 86400) {
    readfile($cacheFile);
    exit;
}

// ---- Fetch HTML ----
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_USERAGENT => 'MediaMetaFetcher/1.0',
    CURLOPT_HTTPHEADER => ['Accept: text/html']
]);

$html = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!$html || $code >= 400) {
    echo json_encode(['ok' => false, 'error' => 'fetch_failed']);
    exit;
}

// ---- Parse ----
libxml_use_internal_errors(true);
$doc = new DOMDocument();
$doc->loadHTML('<?xml encoding="utf-8" ?>' . $html);
libxml_clear_errors();

$data = ['title' => '', 'description' => '', 'image' => ''];

// Meta tags
$metas = $doc->getElementsByTagName('meta');
foreach ($metas as $m) {
    $key = strtolower($m->getAttribute('property') ?: $m->getAttribute('name'));
    $val = trim($m->getAttribute('content'));
    if (!$key || !$val) continue;

    if (in_array($key, ['og:title','twitter:title']) && !$data['title']) $data['title'] = $val;
    if (in_array($key, ['og:description','twitter:description','description']) && !$data['description']) $data['description'] = $val;
    if (in_array($key, ['og:image','twitter:image']) && !$data['image']) $data['image'] = $val;
}

// <title> fallback
if (!$data['title']) {
    $t = $doc->getElementsByTagName('title');
    if ($t->length) $data['title'] = trim($t->item(0)->textContent);
}

// Normalize image URL
if ($data['image']) {
    if (strpos($data['image'], '//') === 0) {
        $scheme = parse_url($url, PHP_URL_SCHEME) ?: 'https';
        $data['image'] = $scheme . ':' . $data['image'];
    } elseif (!preg_match('#^https?://#i', $data['image'])) {
        $scheme = parse_url($url, PHP_URL_SCHEME) ?: 'https';
        $data['image'] = $scheme . '://' . $host . '/' . ltrim($data['image'], '/');
    }
}

$response = [
    'ok' => true,
    'source' => $host,
    'title' => $data['title'],
    'description' => $data['description'],
    'image' => $data['image']
];

file_put_contents($cacheFile, json_encode($response));
echo json_encode($response);
exit;
