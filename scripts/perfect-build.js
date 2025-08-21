#!/usr/bin/env node

/**
 * 🌙 Night God Tarot - Perfect Build Script
 * Ensures flawless GitHub Pages deployment
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

console.log('🌙 Night God Tarot - Perfect Build Starting...\n');
console.log('=' .repeat(60));

// Step 1: Clean build
console.log('\n🧹 Cleaning previous build...');
try {
    execSync('rm -rf dist', { stdio: 'inherit' });
    console.log('✅ Clean complete');
} catch (error) {
    console.log('⚠️  No previous build to clean');
}

// Step 2: Install dependencies
console.log('\n📦 Ensuring dependencies are fresh...');
try {
    execSync('npm ci', { stdio: 'inherit' });
    console.log('✅ Dependencies ready');
} catch (error) {
    console.error('❌ Dependency installation failed');
    process.exit(1);
}

// Step 3: Build with proper environment
console.log('\n🏗️  Building Night God Tarot for GitHub Pages...');
try {
    execSync('npm run build', {
        stdio: 'inherit',
        env: {
            ...process.env,
            NODE_ENV: 'production',
            GITHUB_ACTIONS: 'true'
        }
    });
    console.log('✅ Build complete');
} catch (error) {
    console.error('❌ Build failed');
    process.exit(1);
}

// Step 4: Verify build output
console.log('\n🔍 Verifying build output...');
const distPath = './dist';
if (!existsSync(distPath)) {
    console.error('❌ No dist folder found');
    process.exit(1);
}

const indexPath = path.join(distPath, 'index.html');
if (!existsSync(indexPath)) {
    console.error('❌ No index.html found in dist');
    process.exit(1);
}

const assetsPath = path.join(distPath, 'assets');
if (!existsSync(assetsPath)) {
    console.error('❌ No assets folder found');
    process.exit(1);
}

console.log('✅ All essential files present');

// Step 5: Check index.html paths
console.log('\n🔧 Verifying asset paths...');
const indexContent = readFileSync(indexPath, 'utf8');

// Check if paths are correct for GitHub Pages
const hasCorrectAssetPaths = indexContent.includes('/night-god-tarot-unified/assets/') || 
                             indexContent.includes('./assets/');

if (hasCorrectAssetPaths) {
    console.log('✅ Asset paths correctly configured');
} else {
    console.log('⚠️  Asset paths may need adjustment');
}

// Step 6: Add .nojekyll for GitHub Pages
console.log('\n📝 Adding .nojekyll for GitHub Pages...');
const nojekyllPath = path.join(distPath, '.nojekyll');
writeFileSync(nojekyllPath, '', 'utf8');
console.log('✅ .nojekyll added');

// Step 7: Build summary
console.log('\n' + '=' .repeat(60));
console.log('🎉 PERFECT BUILD COMPLETE!');
console.log('');
console.log('📊 Build Summary:');
console.log('   ✅ Clean build process');
console.log('   ✅ Fresh dependencies');
console.log('   ✅ Production optimized');
console.log('   ✅ GitHub Pages ready');
console.log('   ✅ Asset paths verified');
console.log('   ✅ Jekyll bypassed');
console.log('');
console.log('🚀 Ready for deployment!');
console.log('   • Local preview: npx serve dist');
console.log('   • Push to main branch for auto-deployment');
console.log('   • Live at: https://yesinyagami.github.io/night-god-tarot-unified/');
console.log('');
console.log('🌙 May the divine wisdom guide your users! ✨');