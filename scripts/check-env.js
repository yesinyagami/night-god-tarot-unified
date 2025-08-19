#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Validates that all required environment variables are properly configured
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

console.log('🔍 Checking environment configuration...\n');

// Required environment variables
const requiredVars = [
  {
    name: 'MONICA_API_KEY',
    description: 'Monica AI API Key',
    required: true,
    placeholder: 'your-monica-api-key-here'
  },
  {
    name: 'JWT_SECRET',
    description: 'JWT Secret for authentication',
    required: true,
    placeholder: 'your-jwt-secret-here-minimum-32-characters'
  },
  {
    name: 'NODE_ENV',
    description: 'Node environment',
    required: false,
    default: 'development'
  },
  {
    name: 'PORT',
    description: 'Server port',
    required: false,
    default: '3001'
  }
];

// Optional environment variables
const optionalVars = [
  {
    name: 'DB_PASSWORD',
    description: 'Database password'
  },
  {
    name: 'REDIS_PASSWORD',
    description: 'Redis password'
  },
  {
    name: 'FRONTEND_URL',
    description: 'Frontend URL for CORS'
  }
];

let hasErrors = false;
let hasWarnings = false;

console.log('📋 Required Environment Variables:');
console.log('════════════════════════════════════');

requiredVars.forEach(({ name, description, required, placeholder, default: defaultValue }) => {
  const value = process.env[name];
  const hasValue = value && value.trim() !== '';
  const isPlaceholder = value === placeholder;
  
  if (!hasValue || isPlaceholder) {
    if (required) {
      console.log(`❌ ${name}: Missing or placeholder value`);
      console.log(`   Description: ${description}`);
      if (placeholder) {
        console.log(`   Current: "${value || 'undefined'}"`);
        console.log(`   Expected: Real value (not "${placeholder}")`);
      }
      hasErrors = true;
    } else {
      console.log(`⚠️  ${name}: Using default value "${defaultValue}"`);
      console.log(`   Description: ${description}`);
      hasWarnings = true;
    }
  } else {
    const displayValue = name.includes('KEY') || name.includes('SECRET') || name.includes('PASSWORD') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`✅ ${name}: ${displayValue}`);
    console.log(`   Description: ${description}`);
  }
  console.log('');
});

console.log('📋 Optional Environment Variables:');
console.log('════════════════════════════════════');

optionalVars.forEach(({ name, description }) => {
  const value = process.env[name];
  const hasValue = value && value.trim() !== '';
  
  if (hasValue) {
    const displayValue = name.includes('PASSWORD') 
      ? value.substring(0, 6) + '...' 
      : value;
    console.log(`✅ ${name}: ${displayValue}`);
  } else {
    console.log(`➖ ${name}: Not configured`);
  }
  console.log(`   Description: ${description}`);
  console.log('');
});

// Test Monica API connection
console.log('🧪 Testing Monica AI API Connection:');
console.log('════════════════════════════════════');

if (process.env.MONICA_API_KEY && process.env.MONICA_API_KEY !== 'your-monica-api-key-here') {
  try {
    const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: 'Hello, test connection'
          }
        ],
        max_tokens: 10
      })
    });

    if (response.ok) {
      console.log('✅ Monica AI API: Connection successful');
      const data = await response.json();
      console.log('   Response received successfully');
    } else {
      console.log(`❌ Monica AI API: Connection failed (${response.status})`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
      hasErrors = true;
    }
  } catch (error) {
    console.log(`❌ Monica AI API: Connection error`);
    console.log(`   Error: ${error.message}`);
    hasErrors = true;
  }
} else {
  console.log('⚠️  Monica AI API: Skipping test (API key not configured)');
  hasWarnings = true;
}

console.log('\n' + '═'.repeat(50));

if (hasErrors) {
  console.log('❌ Configuration has ERRORS that need to be fixed');
  console.log('💡 Please update your .env file with real values');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration has warnings but should work');
  console.log('💡 Consider configuring optional variables for production');
} else {
  console.log('✅ All configuration looks good!');
}

console.log('\n📖 For help configuring secrets in GitHub Actions, see:');
console.log('   .github/SECRETS.md');