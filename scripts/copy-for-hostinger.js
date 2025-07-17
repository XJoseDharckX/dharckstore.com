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
        .replace(/src="\/image\//g, 'src="./image')
    
    // Escribir el index.html modificado en la raíz
    fs.writeFileSync('index.html', modifiedContent);
    console.log('✅ index.html actualizado para Hostinger');
} else {
    console.error('❌ Error: No se encontró dist/index.html');
    process.exit(1);
}

// Verificar que los archivos de configuración existen
const configFiles = ['.htaccess', 'web.config'];
configFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} está listo`);
    } else {
        console.warn(`⚠️  ${file} no encontrado`);
    }
});

console.log('🚀 ¡Archivos preparados para Hostinger!');
console.log('\n📋 Archivos a subir:');
console.log('- index.html (raíz)');
console.log('- dist/ (carpeta completa)');
console.log('- image/ (carpeta completa)');
console.log('- api/ (si usas backend)');
console.log('- .htaccess');
console.log('- web.config');