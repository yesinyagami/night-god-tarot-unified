/**
 * Security Cleanup Script
 * Removes exposed secrets from documentation files
 */

import { readFileSync, writeFileSync } from 'fs';
// import { glob } from 'glob'; // Available for future file pattern matching

const EXPOSED_MONICA_KEY = process.env.MONICA_API_KEY || 'your_monica_api_key_here';
const REPLACEMENT = 'your_monica_api_key_here';

console.log('🔒 Starting security cleanup...');

// Files to clean
const filesToClean = [
  'COMPREHENSIVE_ANALYSIS_V2.md',
  'DEPLOYMENT_GUIDE.md', 
  'IMPROVEMENTS_COMPARISON.md',
  'SECURITY_IMPLEMENTATION_GUIDE.md'
];

let cleanedCount = 0;

filesToClean.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    if (content.includes(EXPOSED_MONICA_KEY)) {
      const cleanedContent = content.replaceAll(EXPOSED_MONICA_KEY, REPLACEMENT);
      writeFileSync(file, cleanedContent);
      console.log(`✅ Cleaned: ${file}`);
      cleanedCount++;
    } else {
      console.log(`ℹ️  No secrets found in: ${file}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not process: ${file} - ${error.message}`);
  }
});

console.log(`\n🔒 Security cleanup complete: ${cleanedCount} files cleaned`);
console.log('⚠️  IMPORTANT: The exposed API key should be revoked immediately!');