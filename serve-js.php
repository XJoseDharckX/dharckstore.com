<?php
// Archivo para servir JavaScript con MIME type correcto en Hostinger
$file = $_GET['file'] ?? '';

if (empty($file)) {
    http_response_code(404);
    exit('File not specified');
}

// Sanitizar el nombre del archivo
$file = basename($file);
$filePath = __DIR__ . '/src/' . $file;

// Verificar que el archivo existe y es un archivo JS
if (!file_exists($filePath) || !in_array(pathinfo($file, PATHINFO_EXTENSION), ['js', 'jsx', 'mjs'])) {
    http_response_code(404);
    exit('File not found');
}

// Establecer headers correctos
header('Content-Type: application/javascript; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');

// Servir el archivo
readfile($filePath);
?>