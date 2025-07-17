import fs from 'fs';
import path from 'path';

console.log('📦 Preparando archivos para Hostinger...');

// Verificar que la carpeta dist existe
if (!fs.existsSync('dist')) {
    console.error('❌ Error: La carpeta dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
}

// Leer el index.html generado por Vite
const distIndexPath = 'dist/index.html';
if (fs.existsSync(distIndexPath)) {
    const indexContent = fs.readFileSync(distIndexPath, 'utf8');
    
    // Modificar las rutas para que sean relativas y funcionen en Hostinger
    const modifiedContent = indexContent
        .replace(/href="\/assets\//g, 'href="./dist/assets/')
        .replace(/src="\/assets\//g, 'src="./dist/assets/')
        .replace(/href="\/image\//g, 'href="./image/')
        .replace(/src="\/image\//g, 'src="./image/')
        .replace(/\/favicon\.ico/g, './favicon.ico');
    
    // Escribir el index.html modificado en la raíz
    fs.writeFileSync('index.html', modifiedContent);
    console.log('✅ index.html actualizado para Hostinger');
} else {
    console.error('❌ Error: No se encontró dist/index.html');
    process.exit(1);
}

// Crear un archivo PHP simple para que Hostinger reconozca el proyecto
const phpContent = `<?php
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
if (preg_match('/\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/', $path)) {
    return false;
}

// Para todas las demás rutas, servir index.html
readfile('index.html');
?>`;

fs.writeFileSync('index.php', phpContent);
console.log('✅ index.php creado para compatibilidad con Hostinger');

// Verificar que los archivos de configuración existen
const configFiles = ['.htaccess', 'web.config'];
configFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} está listo`);
    } else {
        console.warn(`⚠️  ${file} no encontrado`);
    }
});

// Crear un archivo de información del deployment
const deployInfo = {
    timestamp: new Date().toISOString(),
    version: JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
    environment: 'production',
    platform: 'hostinger'
};

fs.writeFileSync('deploy-info.json', JSON.stringify(deployInfo, null, 2));
console.log('✅ deploy-info.json creado');

console.log('🚀 ¡Archivos preparados para Hostinger!');
console.log('\n📋 Archivos listos para deployment:');
console.log('- index.html (raíz)');
console.log('- index.php (compatibilidad)');
console.log('- dist/ (carpeta completa)');
console.log('- image/ (carpeta completa)');
console.log('- api/ (si usas backend)');
console.log('- .htaccess');
console.log('- web.config');
console.log('- composer.json');
console.log('- composer.lock');
console.log('- deploy-info.json');