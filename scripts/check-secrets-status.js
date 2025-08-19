/**
 * GitHub Secrets 狀態檢查腳本
 * 用於驗證所有必要的 secrets 是否已設置
 */

import { execSync } from 'child_process';

const GITHUB_TOKEN = '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';
const REPO = 'yesinyagami/night-god-tarot-unified';

const REQUIRED_SECRETS = [
  'MONICA_API_KEY',
  'JWT_SECRET',
  'DB_PASSWORD',
  'REDIS_PASSWORD',
  'CODECOV_TOKEN'
];

async function checkSecretsStatus() {
  console.log('🔍 檢查 GitHub Secrets 設置狀態...\n');
  
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const data = await response.json();
    const existingSecrets = data.secrets?.map(s => s.name) || [];
    
    console.log(`📊 當前 Secrets 狀態：${existingSecrets.length}/${REQUIRED_SECRETS.length} 已設置\n`);
    
    REQUIRED_SECRETS.forEach(secretName => {
      const isSet = existingSecrets.includes(secretName);
      const status = isSet ? '✅' : '❌';
      const optional = secretName === 'CODECOV_TOKEN' ? ' (可選)' : '';
      console.log(`${status} ${secretName}${optional}`);
    });
    
    const missingSecrets = REQUIRED_SECRETS.filter(name => !existingSecrets.includes(name));
    
    if (missingSecrets.length > 0) {
      console.log('\n❌ 缺少的 Secrets：');
      missingSecrets.forEach(name => {
        if (name !== 'CODECOV_TOKEN') { // CODECOV_TOKEN 是可選的
          console.log(`   - ${name}`);
        }
      });
      
      console.log('\n🔗 設置 Secrets：');
      console.log(`   ${`https://github.com/${REPO}/settings/secrets/actions`}`);
      
      return false;
    } else {
      console.log('\n✅ 所有必要的 secrets 已設置！');
      return true;
    }
    
  } catch (error) {
    console.error('❌ 檢查失敗：', error.message);
    return false;
  }
}

async function checkWorkflowStatus() {
  console.log('\n🔄 檢查最新 Workflow 執行狀態...\n');
  
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/actions/runs?per_page=1`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const data = await response.json();
    const latestRun = data.workflow_runs?.[0];
    
    if (latestRun) {
      const status = latestRun.status;
      const conclusion = latestRun.conclusion;
      const statusEmoji = conclusion === 'success' ? '✅' : conclusion === 'failure' ? '❌' : '🟡';
      
      console.log(`${statusEmoji} 最新 Workflow：`);
      console.log(`   狀態：${status}`);
      console.log(`   結果：${conclusion || 'N/A'}`);
      console.log(`   連結：${latestRun.html_url}`);
      
      return conclusion === 'success';
    }
    
  } catch (error) {
    console.error('❌ 檢查 Workflow 失敗：', error.message);
  }
  
  return false;
}

// 主要執行函數
async function main() {
  console.log('🔐 GitHub Actions 狀態檢查\n');
  console.log('==========================\n');
  
  const secretsOk = await checkSecretsStatus();
  const workflowOk = await checkWorkflowStatus();
  
  console.log('\n📋 總結：');
  console.log(`   Secrets 設置：${secretsOk ? '✅ 完成' : '❌ 需要設置'}`);
  console.log(`   Workflow 狀態：${workflowOk ? '✅ 成功' : '❌ 失敗'}`);
  
  if (!secretsOk) {
    console.log('\n⚠️  請先設置缺少的 secrets，然後重新執行此腳本');
  } else if (!workflowOk) {
    console.log('\n🔄 Secrets 已設置，但 Workflow 仍失敗。請檢查具體錯誤');
  } else {
    console.log('\n🎉 一切正常！GitHub Actions 應該正常工作');
  }
}

main().catch(console.error);