/**
 * Build script for design-system package
 * Runs tsup and copies style.css to dist
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building design-system...');

// Run tsup
console.log('  Running tsup...');
execSync('npx tsup', { stdio: 'inherit' });

// Copy style.css
const srcPath = path.resolve(__dirname, 'src/style.css');
const distPath = path.resolve(__dirname, 'dist/style.css');

console.log('  Copying style.css...');
if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, distPath);
  console.log('  ✅ style.css copied to dist/');
} else {
  console.warn('  ⚠️  src/style.css not found');
}

console.log('✅ Build complete!');
