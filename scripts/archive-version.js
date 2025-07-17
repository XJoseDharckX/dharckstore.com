import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Crear directorio de versiones si no existe
const versionsDir = path.join(__dirname, '../versions');
if (!fs.existsSync(versionsDir)) {
    fs.mkdirSync(versionsDir, { recursive: true });
}

// Crear directorio para esta versión
const versionDir = path.join(versionsDir, `v${version}-${timestamp}`);
fs.mkdirSync(versionDir, { recursive: true });

// Copiar archivos importantes
const filesToArchive = [
    'dist',
    'src',
    'package.json',
    'vite.config.js',
    'index.html'
];

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

filesToArchive.forEach(file => {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(versionDir, file);
    
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
        console.log(`✓ Archived: ${file}`);
    }
});

// Crear archivo de información de la versión
const versionInfo = {
    version: version,
    timestamp: new Date().toISOString(),
    buildHash: Math.random().toString(36).substring(7),
    files: filesToArchive.filter(file => fs.existsSync(path.join(__dirname, '..', file)))
};

fs.writeFileSync(
    path.join(versionDir, 'version-info.json'),
    JSON.stringify(versionInfo, null, 2)
);

console.log(`\n🎉 Version ${version} archived successfully!`);
console.log(`📁 Location: ${versionDir}`);