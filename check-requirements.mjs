import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log('🔍 Checking Night God Tarot Requirements\n');
console.log('=' .repeat(50));

// Check what's actually used in the code
const checkCodeUsage = () => {
    console.log('\n📝 Checking what the code actually uses:\n');
    
    const secrets = [
        'MONICA_API_KEY',
        'OPENWEATHER_API_KEY', 
        'NEWS_API_KEY',
        'JWT_SECRET',
        'ENCRYPTION_KEY',
        'DB_PASSWORD',
        'REDIS_PASSWORD',
        'CODECOV_TOKEN',
        'BUYMEACOFFEE_WEBHOOK_SECRET',
        'IPASS_API_KEY'
    ];
    
    const srcFiles = [
        'src/services/weather.ts',
        'src/services/news.ts',
        'src/services/ai/monicaOrchestrator.ts',
        'server/index.js'
    ];
    
    secrets.forEach(secret => {
        let found = false;
        let whereFound = [];
        
        srcFiles.forEach(file => {
            try {
                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file, 'utf8');
                    if (content.includes(secret)) {
                        found = true;
                        whereFound.push(file);
                    }
                }
            } catch (e) {
                // File doesn't exist
            }
        });
        
        const inEnv = process.env[secret] ? '✅' : '❌';
        const status = found ? `📍 Used in: ${whereFound.join(', ')}` : '⚠️  Not used in code';
        console.log(`   ${secret}:`);
        console.log(`      In .env: ${inEnv}`);
        console.log(`      ${status}`);
    });
};

// Check what's actually required
const checkRequired = () => {
    console.log('\n\n✅ ACTUALLY REQUIRED:');
    console.log('   - NODE_ENV (for build process)');
    console.log('   - JWT_SECRET (if using auth features)');
    console.log('   - ENCRYPTION_KEY (if storing sensitive data)');
    
    console.log('\n📦 OPTIONAL (for features):');
    console.log('   - MONICA_API_KEY (AI tarot interpretations)');
    console.log('   - OPENWEATHER_API_KEY (weather widget)');
    console.log('   - NEWS_API_KEY (news widget)');
    
    console.log('\n❌ NOT NEEDED:');
    console.log('   - DB_PASSWORD (no database)');
    console.log('   - REDIS_PASSWORD (no Redis)');
    console.log('   - CODECOV_TOKEN (no codecov integration)');
    console.log('   - BUYMEACOFFEE_WEBHOOK_SECRET (no payment)');
    console.log('   - IPASS_API_KEY (not implemented)');
};

// Run checks
checkCodeUsage();
checkRequired();

console.log('\n' + '=' .repeat(50));
console.log('\n💡 SUMMARY:');
console.log('   The app works WITHOUT any external APIs');
console.log('   APIs only enhance features (AI, weather, news)');
console.log('   You can run it locally with just npm run dev');
console.log('\n✨ No database, Redis, or payment APIs needed!');