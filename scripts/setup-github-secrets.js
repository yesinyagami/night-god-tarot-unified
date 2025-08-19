/**
 * GitHub Secrets Setup Script
 * 用於自動設置 GitHub Actions 所需的 secrets
 */

import { execSync } from 'child_process';
import crypto from 'crypto';

// 生成隨機密鑰的函數
function generateSecretKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// 需要設置的 secrets
const secrets = {
  'MONICA_API_KEY': process.env.MONICA_API_KEY || 'your_monica_api_key_here',
  'JWT_SECRET': generateSecretKey(32),
  'DB_PASSWORD': generateSecretKey(16),
  'REDIS_PASSWORD': generateSecretKey(16),
  'CODECOV_TOKEN': process.env.CODECOV_TOKEN || 'your_codecov_token_here'
};

console.log('🔐 GitHub Secrets 設置指南');
console.log('=======================\n');

console.log('請手動在 GitHub 上設置以下 secrets：');
console.log('路徑：GitHub Repository > Settings > Secrets and variables > Actions\n');

Object.entries(secrets).forEach(([key, value]) => {
  console.log(`📝 Secret Name: ${key}`);
  console.log(`   Value: ${value}`);
  console.log(`   Description: ${getSecretDescription(key)}`);
  console.log('');
});

console.log('\n🌐 設置步驟：');
console.log('1. 登入 GitHub: https://github.com/yesinyagami/night-god-tarot-unified');
console.log('2. 前往 Settings > Secrets and variables > Actions');
console.log('3. 點擊 "New repository secret"');
console.log('4. 輸入 Secret Name 和 Value');
console.log('5. 點擊 "Add secret"');
console.log('6. 重複步驟 3-5 設置所有 secrets');

console.log('\n⚠️  重要提醒：');
console.log('- 請將 MONICA_API_KEY 替換為您實際的 Monica API key');
console.log('- 請將 CODECOV_TOKEN 替換為您的 Codecov token（可選）');
console.log('- 其他密鑰已自動生成，可直接使用');

function getSecretDescription(key) {
  const descriptions = {
    'MONICA_API_KEY': 'Monica AI API 密鑰，用於塔羅牌解讀',
    'JWT_SECRET': 'JWT token 簽名密鑰，用於用戶認證',
    'DB_PASSWORD': '資料庫密碼，用於生產環境',
    'REDIS_PASSWORD': 'Redis 密碼，用於緩存',
    'CODECOV_TOKEN': 'Codecov token，用於代碼覆蓋率報告（可選）'
  };
  return descriptions[key] || '未知用途';
}