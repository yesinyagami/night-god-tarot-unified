#!/usr/bin/env node
/**
 * 🚀 DEPLOY SECRETS TO GITHUB NOW
 * This script will actually set the GitHub repository secrets
 */

const { execSync } = require('child_process');
const { readFileSync } = require('fs');

// GitHub repository info
const GITHUB_REPO = 'yesinyagami/night-god-tarot-unified';
const GITHUB_API = 'https://api.github.com';

console.log('🚀 Deploying Secrets to GitHub Repository');
console.log('========================================');
console.log(`Repository: ${GITHUB_REPO}`);
console.log('');

// Read environment variables from .env
console.log('📋 Reading secrets from .env file...');
const envContent = readFileSync('.env', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...values] = trimmed.split('=');
    if (key && values.length > 0) {
      envVars[key] = values.join('=');
    }
  }
});

// Critical secrets to deploy
const secretsToDeploy = {
  'MONICA_API_KEY': envVars.MONICA_API_KEY,
  'VITE_MONICA_API_KEY': envVars.VITE_MONICA_API_KEY,
  'MONICA_BASE_URL': envVars.MONICA_BASE_URL,
  'JWT_SECRET': envVars.JWT_SECRET,
  'ENCRYPTION_KEY': envVars.ENCRYPTION_KEY,
  'APP_SECRET': envVars.APP_SECRET,
  'OPENWEATHER_API_KEY': envVars.OPENWEATHER_API_KEY,
  'VITE_OPENWEATHER_API_KEY': envVars.VITE_OPENWEATHER_API_KEY,
  'NEWS_API_KEY': envVars.NEWS_API_KEY,
  'VITE_NEWS_API_KEY': envVars.VITE_NEWS_API_KEY,
  'DB_PASSWORD': envVars.DB_PASSWORD,
  'REDIS_PASSWORD': envVars.REDIS_PASSWORD,
  'WEBHOOK_SECRET': envVars.WEBHOOK_SECRET,
  'BUYMEACOFFEE_WEBHOOK_SECRET': envVars.BUYMEACOFFEE_WEBHOOK_SECRET,
  'IPASS_API_KEY': envVars.IPASS_API_KEY,
  'IPASS_API_SECRET': envVars.IPASS_API_SECRET
};

console.log('🔑 Secrets to deploy:');
Object.entries(secretsToDeploy).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 15)}...`);
  } else {
    console.log(`❌ ${key}: Missing in .env`);
  }
});

console.log('');
console.log('🎯 DEPLOYING SECRETS NOW...');
console.log('==========================');

// Try different methods to deploy secrets
let deploymentSuccess = false;

// Method 1: Try GitHub CLI
console.log('📡 Method 1: Attempting GitHub CLI deployment...');
try {
  // Check if gh is available
  execSync('gh --version', { stdio: 'pipe' });
  console.log('✅ GitHub CLI is available');
  
  // Check authentication
  execSync('gh auth status', { stdio: 'pipe' });
  console.log('✅ GitHub CLI is authenticated');
  
  // Deploy secrets using gh CLI
  let successCount = 0;
  for (const [key, value] of Object.entries(secretsToDeploy)) {
    if (value) {
      try {
        execSync(`gh secret set ${key} --body "${value}"`, { stdio: 'pipe' });
        console.log(`✅ Deployed: ${key}`);
        successCount++;
      } catch (error) {
        console.log(`❌ Failed to deploy ${key}: ${error.message}`);
      }
    }
  }
  
  if (successCount > 0) {
    deploymentSuccess = true;
    console.log(`🎉 Successfully deployed ${successCount} secrets via GitHub CLI!`);
  }
  
} catch (error) {
  console.log('❌ GitHub CLI not available or not authenticated');
  console.log('💡 Install: https://cli.github.com/');
  console.log('💡 Then run: gh auth login');
}

// Method 2: Generate curl commands for manual execution
if (!deploymentSuccess) {
  console.log('');
  console.log('📋 Method 2: Manual API Commands');
  console.log('================================');
  console.log('Since GitHub CLI is not available, you can use these curl commands:');
  console.log('(You need a GitHub Personal Access Token with repo scope)');
  console.log('');
  
  Object.entries(secretsToDeploy).forEach(([key, value]) => {
    if (value) {
      console.log(`curl -X PUT \\`);
      console.log(`  -H "Accept: application/vnd.github.v3+json" \\`);
      console.log(`  -H "Authorization: token YOUR_GITHUB_TOKEN" \\`);
      console.log(`  https://api.github.com/repos/${GITHUB_REPO}/actions/secrets/${key} \\`);
      console.log(`  -d '{"encrypted_value":"${Buffer.from(value).toString('base64')}","key_id":"YOUR_KEY_ID"}'`);
      console.log('');
    }
  });
}

// Method 3: Show direct GitHub UI instructions
console.log('');
console.log('🌐 Method 3: GitHub Web Interface (RECOMMENDED)');
console.log('===============================================');
console.log('Go to this URL and add each secret manually:');
console.log(`🔗 https://github.com/${GITHUB_REPO}/settings/secrets/actions`);
console.log('');
console.log('Click "New repository secret" for each:');
console.log('');

Object.entries(secretsToDeploy).forEach(([key, value]) => {
  if (value) {
    console.log(`Name: ${key}`);
    console.log(`Value: ${value}`);
    console.log('---');
  }
});

console.log('');
console.log('🧪 After deployment, test with:');
console.log('===============================');
console.log('1. Go to Actions tab in your GitHub repository');
console.log('2. Look for green checkmarks on workflows');
console.log('3. Run the "Deploy & Test API Keys" workflow');
console.log('4. Check that Monica AI connection test passes');
console.log('');

if (deploymentSuccess) {
  console.log('🎉 DEPLOYMENT COMPLETE!');
  console.log('Your GitHub secrets have been successfully deployed.');
  console.log('Check your GitHub Actions - they should now show green!');
} else {
  console.log('⚠️ MANUAL DEPLOYMENT REQUIRED');
  console.log('Please use the GitHub web interface to add the secrets above.');
  console.log('Your API keys from .env are ready to copy-paste!');
}

console.log('');
console.log('🌟 Night God Tarot - Divine Technology Deployed! ✨');