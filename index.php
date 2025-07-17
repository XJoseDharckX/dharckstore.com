<?php
// DharckStore - Gaming Recharges México
// Este archivo permite que Hostinger reconozca el proyecto como PHP
// pero la aplicación principal es React

// Redirigir todas las peticiones al index.html
if (!file_exists('index.html')) {
    http_response_code(404);
    echo 'Error: Aplicación no encontrada. Ejecuta el build primero.';
    exit;
}

// Servir el index.html para todas las rutas (SPA)
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Si es una petición de archivo estático, dejar que Apache lo maneje
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/', $path)) {
    return false;
}

// Para todas las demás rutas, servir index.html
readfile('index.html');
?>