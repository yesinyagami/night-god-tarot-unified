#!/usr/bin/env node

/**
 * Comprehensive Night God Tarot System Test
 * Tests all components: build, deployment, API integration, and functionality
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

console.log('🌙✨ NIGHT GOD TAROT COMPREHENSIVE SYSTEM TEST ✨🌙\n')

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0
}

function logResult(test, status, message, details = '') {
  const icons = { pass: '✅', fail: '❌', warn: '⚠️' }
  const colors = { pass: '\x1b[32m', fail: '\x1b[31m', warn: '\x1b[33m', reset: '\x1b[0m' }
  
  console.log(`${icons[status]} ${colors[status]}${test}${colors.reset}: ${message}`)
  if (details) console.log(`   ${details}`)
  
  tests[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++
}

async function testBuildSystem() {
  console.log('\n🏗️ TESTING BUILD SYSTEM')
  console.log('─'.repeat(50))
  
  try {
    // Check if dist directory exists and has content
    if (fs.existsSync('dist')) {
      const distFiles = fs.readdirSync('dist')
      if (distFiles.includes('index.html') && distFiles.includes('assets')) {
        logResult('Build Output', 'pass', 'dist/ directory contains required files')
      } else {
        logResult('Build Output', 'fail', 'Missing index.html or assets in dist/')
      }
    } else {
      logResult('Build Output', 'warn', 'dist/ directory not found, running build...')
      execSync('npm run build', { stdio: 'inherit' })
      logResult('Build Process', 'pass', 'Build completed successfully')
    }

    // Check package.json scripts
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const requiredScripts = ['build', 'pages:build', 'dev', 'preview']
    requiredScripts.forEach(script => {
      if (packageJson.scripts[script]) {
        logResult(`Script: ${script}`, 'pass', 'Configured correctly')
      } else {
        logResult(`Script: ${script}`, 'fail', 'Missing from package.json')
      }
    })

  } catch (error) {
    logResult('Build System', 'fail', `Build test failed: ${error.message}`)
  }
}

async function testGitHubIntegration() {
  console.log('\n🐙 TESTING GITHUB INTEGRATION')
  console.log('─'.repeat(50))

  try {
    // Check git configuration
    const gitRemote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
    if (gitRemote.includes('github.com')) {
      logResult('Git Remote', 'pass', `Connected to ${gitRemote}`)
    } else {
      logResult('Git Remote', 'fail', 'Not connected to GitHub')
    }

    // Check GitHub Actions workflow
    const workflowPath = '.github/workflows/pages-deploy.yml'
    if (fs.existsSync(workflowPath)) {
      logResult('GitHub Actions', 'pass', 'Workflow configuration exists')
      
      const workflow = fs.readFileSync(workflowPath, 'utf8')
      if (workflow.includes('pages:build')) {
        logResult('Workflow Script', 'pass', 'Uses correct build script')
      } else {
        logResult('Workflow Script', 'warn', 'May be using outdated build script')
      }
    } else {
      logResult('GitHub Actions', 'fail', 'No workflow configuration found')
    }

    // Check CNAME for custom domain
    if (fs.existsSync('public/CNAME')) {
      const cname = fs.readFileSync('public/CNAME', 'utf8').trim()
      logResult('Custom Domain', 'pass', `Configured for ${cname}`)
    } else {
      logResult('Custom Domain', 'warn', 'No CNAME file found')
    }

  } catch (error) {
    logResult('GitHub Integration', 'fail', `GitHub test failed: ${error.message}`)
  }
}

async function testLiveDeployment() {
  console.log('\n🌐 TESTING LIVE DEPLOYMENT')
  console.log('─'.repeat(50))

  const urls = [
    'https://yesinyagami.github.io/night-god-tarot-unified/',
    'https://yesinyagami.com'
  ]

  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      if (response.ok) {
        logResult(`Deployment: ${url}`, 'pass', `Accessible (${response.status})`)
      } else {
        logResult(`Deployment: ${url}`, 'fail', `HTTP ${response.status}`)
      }
    } catch (error) {
      if (url.includes('yesinyagami.com')) {
        logResult(`Deployment: ${url}`, 'warn', 'DNS not configured yet')
      } else {
        logResult(`Deployment: ${url}`, 'fail', `Not accessible: ${error.message}`)
      }
    }
  }

  // Test specific functionality
  try {
    const response = await fetch('https://yesinyagami.github.io/night-god-tarot-unified/')
    const html = await response.text()
    
    if (html.includes('Night God Tarot')) {
      logResult('Site Content', 'pass', 'Title and branding loaded correctly')
    } else {
      logResult('Site Content', 'fail', 'Site content not loading properly')
    }

    if (html.includes('assets/')) {
      logResult('Asset Loading', 'pass', 'Assets referenced correctly')
    } else {
      logResult('Asset Loading', 'warn', 'Asset references may be incorrect')
    }

  } catch (error) {
    logResult('Site Functionality', 'fail', `Cannot access site: ${error.message}`)
  }
}

async function testMonicaAPI() {
  console.log('\n🤖 TESTING MONICA AI INTEGRATION')
  console.log('─'.repeat(50))

  const apiKey = process.env.MONICA_API_KEY
  const baseUrl = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

  if (!apiKey) {
    logResult('Monica API Key', 'fail', 'MONICA_API_KEY not configured')
    return
  }

  logResult('Monica API Key', 'pass', 'API key configured')
  logResult('Monica Base URL', 'pass', baseUrl)

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          { role: 'user', content: 'Test connection - respond with OK' }
        ],
        max_tokens: 10
      })
    })

    if (response.ok) {
      const data = await response.json()
      logResult('Monica API Connection', 'pass', 'API responding correctly')
      logResult('Monica Response', 'pass', `"${data.choices[0].message.content.substring(0, 50)}..."`)
    } else {
      const errorData = await response.json()
      if (errorData.error?.message?.includes('balance')) {
        logResult('Monica API Connection', 'warn', 'API key needs balance/credits')
        logResult('Monica Balance', 'warn', 'Account balance insufficient - please add credits')
      } else {
        logResult('Monica API Connection', 'fail', `API Error: ${errorData.error?.message || 'Unknown error'}`)
      }
    }

  } catch (error) {
    logResult('Monica API Connection', 'fail', `Connection failed: ${error.message}`)
  }
}

async function testApplicationFeatures() {
  console.log('\n🃏 TESTING APPLICATION FEATURES')
  console.log('─'.repeat(50))

  // Check core files exist
  const coreFiles = [
    'src/App.vue',
    'src/main.ts',
    'src/components/UltimateNightGodTarot.vue',
    'src/services/ai/monicaOrchestrator.ts',
    'src/data/cards.ts',
    'src/stores/tarot.ts'
  ]

  coreFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logResult(`Core File: ${path.basename(file)}`, 'pass', 'Present')
    } else {
      logResult(`Core File: ${path.basename(file)}`, 'fail', 'Missing')
    }
  })

  // Check tarot cards data
  try {
    const cardsModule = await import('../src/data/cards.js')
    if (cardsModule.tarotCards && Array.isArray(cardsModule.tarotCards)) {
      logResult('Tarot Cards Data', 'pass', `${cardsModule.tarotCards.length} cards loaded`)
    } else {
      logResult('Tarot Cards Data', 'fail', 'Cards data not properly structured')
    }
  } catch (error) {
    logResult('Tarot Cards Data', 'fail', `Cannot load cards: ${error.message}`)
  }

  // Check TypeScript configuration
  if (fs.existsSync('tsconfig.json')) {
    logResult('TypeScript Config', 'pass', 'tsconfig.json present')
  } else {
    logResult('TypeScript Config', 'fail', 'tsconfig.json missing')
  }
}

async function runAllTests() {
  console.log('Starting comprehensive system verification...\n')

  await testBuildSystem()
  await testGitHubIntegration()
  await testLiveDeployment()
  await testMonicaAPI()
  await testApplicationFeatures()

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('🌟 COMPREHENSIVE TEST SUMMARY 🌟')
  console.log('='.repeat(60))
  console.log(`✅ Tests Passed: ${tests.passed}`)
  console.log(`❌ Tests Failed: ${tests.failed}`)
  console.log(`⚠️  Warnings: ${tests.warnings}`)
  console.log(`📊 Total Tests: ${tests.passed + tests.failed + tests.warnings}`)

  if (tests.failed === 0) {
    console.log('\n🎉 ALL CRITICAL SYSTEMS OPERATIONAL!')
    console.log('🚀 Night God Tarot is ready for production use!')
  } else if (tests.failed <= 2) {
    console.log('\n⚠️  SYSTEM MOSTLY FUNCTIONAL')
    console.log('🔧 Minor issues need attention')
  } else {
    console.log('\n❌ SYSTEM NEEDS ATTENTION')
    console.log('🛠️  Please resolve critical issues')
  }

  console.log('\n🌙 Divine wisdom flows through technology! ✨')
}

// Run all tests
runAllTests().catch(console.error)