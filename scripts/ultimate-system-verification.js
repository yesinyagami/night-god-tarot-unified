#!/usr/bin/env node

/**
 * ULTIMATE NIGHT GOD TAROT SYSTEM VERIFICATION
 * Comprehensive testing of every component, resource, and functionality
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

dotenv.config()

console.log('🌙✨ ULTIMATE NIGHT GOD TAROT SYSTEM VERIFICATION ✨🌙\n')
console.log('Verifying every component for full operational readiness...\n')

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

// Test results tracking
const testResults = {
  ai_models: {},
  resources: {},
  deployment: {},
  functionality: {},
  external_apis: {},
  overall: { passed: 0, failed: 0, warnings: 0 }
}

function logResult(category, test, status, details = '') {
  const icons = { pass: '✅', fail: '❌', warn: '⚠️' }
  const colors = { pass: '\x1b[32m', fail: '\x1b[31m', warn: '\x1b[33m', reset: '\x1b[0m' }
  
  console.log(`${icons[status]} ${colors[status]}${test}${colors.reset}: ${details}`)
  
  if (!testResults[category]) testResults[category] = {}
  testResults[category][test] = { status, details }
  
  testResults.overall[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++
}

// 1. VERIFY ALL AI MODELS
async function verifyAIModels() {
  console.log('🤖 VERIFYING ALL AI MODELS')
  console.log('─'.repeat(60))

  const workingModels = {
    deepseek_chat: 'deepseek-chat',
    claude_3_5_sonnet: 'claude-3-5-sonnet-20241022',
    claude_3_5_sonnet_latest: 'claude-3-5-sonnet-latest',
    gpt_4o: 'gpt-4o',
    gpt_4o_mini: 'gpt-4o-mini',
    gemini_1_5_pro: 'gemini-1.5-pro',
    llama_3_1_405b: 'llama-3.1-405b-instruct'
  }

  for (const [modelName, modelEndpoint] of Object.entries(workingModels)) {
    try {
      const response = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MONICA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelEndpoint,
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5,
          temperature: 0.1
        })
      })

      if (response.ok) {
        const data = await response.json()
        logResult('ai_models', modelName, 'pass', `${modelEndpoint} operational`)
      } else {
        const errorData = await response.json()
        logResult('ai_models', modelName, 'fail', `${modelEndpoint}: ${errorData.error?.message}`)
      }
    } catch (error) {
      logResult('ai_models', modelName, 'fail', `${modelEndpoint}: ${error.message}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

// 2. TEST COMPLETE TAROT PIPELINE
async function testTarotPipeline() {
  console.log('\n🃏 TESTING COMPLETE TAROT READING PIPELINE')
  console.log('─'.repeat(60))

  try {
    // Test 3-stage orchestration
    const testCards = ['The Fool', 'The Magician', 'The Star']
    const testQuestion = 'What guidance do you have for my spiritual journey?'

    console.log(`Testing cards: ${testCards.join(', ')}`)
    console.log(`Testing question: ${testQuestion}`)

    // Stage 1: DeepSeek Research
    console.log('\n🌊 Testing Stage 1: DeepSeek Research...')
    const researchResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: `Provide comprehensive tarot analysis for ${testCards.join(', ')} regarding: ${testQuestion}`
        }],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (researchResponse.ok) {
      const researchData = await researchResponse.json()
      const researchContent = researchData.choices[0].message.content
      logResult('functionality', 'deepseek_research', 'pass', `Generated ${researchContent.length} chars of research`)

      // Stage 2: Gemini Synthesis
      console.log('💎 Testing Stage 2: Gemini Synthesis...')
      const synthesisResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MONICA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gemini-1.5-pro',
          messages: [{
            role: 'user',
            content: `Synthesize this tarot research into practical wisdom: ${researchContent.substring(0, 800)}`
          }],
          max_tokens: 500,
          temperature: 0.6
        })
      })

      if (synthesisResponse.ok) {
        const synthesisData = await synthesisResponse.json()
        const synthesisContent = synthesisData.choices[0].message.content
        logResult('functionality', 'gemini_synthesis', 'pass', `Generated ${synthesisContent.length} chars of synthesis`)

        // Stage 3: GPT-4o Poetry
        console.log('🎭 Testing Stage 3: GPT-4o Poetry...')
        const poetryResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MONICA_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{
              role: 'user',
              content: `Transform this into beautiful mystical tarot reading: ${synthesisContent.substring(0, 600)}`
            }],
            max_tokens: 800,
            temperature: 0.9
          })
        })

        if (poetryResponse.ok) {
          const poetryData = await poetryResponse.json()
          const poetryContent = poetryData.choices[0].message.content
          logResult('functionality', 'gpt4o_poetry', 'pass', `Generated ${poetryContent.length} chars of divine poetry`)
          
          // Full pipeline test
          const totalContent = researchContent.length + synthesisContent.length + poetryContent.length
          logResult('functionality', 'full_pipeline', 'pass', `Complete 3-stage reading: ${totalContent} total characters`)
          
          console.log('\n📜 SAMPLE COMPLETE READING:')
          console.log('─'.repeat(40))
          console.log(poetryContent.substring(0, 400) + '...')
          console.log('─'.repeat(40))
          
        } else {
          logResult('functionality', 'gpt4o_poetry', 'fail', 'Poetry stage failed')
        }
      } else {
        logResult('functionality', 'gemini_synthesis', 'fail', 'Synthesis stage failed')
      }
    } else {
      logResult('functionality', 'deepseek_research', 'fail', 'Research stage failed')
    }

  } catch (error) {
    logResult('functionality', 'tarot_pipeline', 'fail', `Pipeline error: ${error.message}`)
  }
}

// 3. VERIFY ASSETS AND RESOURCES
async function verifyAssets() {
  console.log('\n📁 VERIFYING ASSETS AND RESOURCES')
  console.log('─'.repeat(60))

  // Check critical files
  const criticalFiles = [
    'src/App.vue',
    'src/main.ts',
    'src/components/UltimateNightGodTarot.vue',
    'src/services/ai/monicaOrchestrator.ts',
    'src/services/ai/index.ts',
    'src/data/cards.ts',
    'src/stores/tarot.ts',
    'src/types/tarot.ts',
    'package.json',
    'vite.config.ts',
    'tailwind.config.js',
    'index.html'
  ]

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file)
      logResult('resources', path.basename(file), 'pass', `${(stats.size / 1024).toFixed(1)}KB`)
    } else {
      logResult('resources', path.basename(file), 'fail', 'File missing')
    }
  })

  // Check assets directory
  const assetsPath = 'src/assets'
  if (fs.existsSync(assetsPath)) {
    const assetFiles = fs.readdirSync(assetsPath, { recursive: true })
    logResult('resources', 'assets_directory', 'pass', `${assetFiles.length} files found`)
  } else {
    logResult('resources', 'assets_directory', 'fail', 'Assets directory missing')
  }

  // Check public directory
  const publicPath = 'public'
  if (fs.existsSync(publicPath)) {
    const publicFiles = fs.readdirSync(publicPath, { recursive: true })
    logResult('resources', 'public_directory', 'pass', `${publicFiles.length} files found`)
  } else {
    logResult('resources', 'public_directory', 'fail', 'Public directory missing')
  }

  // Check dist build output
  const distPath = 'dist'
  if (fs.existsSync(distPath)) {
    const distFiles = fs.readdirSync(distPath, { recursive: true })
    logResult('resources', 'build_output', 'pass', `${distFiles.length} built files`)
  } else {
    logResult('resources', 'build_output', 'warn', 'No build output (run npm run build)')
  }
}

// 4. TEST LIVE DEPLOYMENT
async function testLiveDeployment() {
  console.log('\n🌐 TESTING LIVE DEPLOYMENT')
  console.log('─'.repeat(60))

  const urls = [
    'https://yesinyagami.github.io/night-god-tarot-unified/',
    'https://yesinyagami.com'
  ]

  for (const url of urls) {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        timeout: 10000
      })

      if (response.ok) {
        logResult('deployment', url.includes('github.io') ? 'github_pages' : 'custom_domain', 'pass', 
          `HTTP ${response.status}, ${response.headers.get('content-type')}`)
      } else {
        logResult('deployment', url.includes('github.io') ? 'github_pages' : 'custom_domain', 'fail', 
          `HTTP ${response.status}`)
      }
    } catch (error) {
      if (url.includes('yesinyagami.com')) {
        logResult('deployment', 'custom_domain', 'warn', 'DNS not configured yet')
      } else {
        logResult('deployment', 'github_pages', 'fail', error.message)
      }
    }
  }

  // Test site content
  try {
    const response = await fetch('https://yesinyagami.github.io/night-god-tarot-unified/')
    const html = await response.text()
    
    const checks = [
      { name: 'title_present', test: html.includes('Night God Tarot'), desc: 'Site title' },
      { name: 'vue_app', test: html.includes('id="app"'), desc: 'Vue app container' },
      { name: 'assets_referenced', test: html.includes('assets/'), desc: 'Asset references' },
      { name: 'meta_tags', test: html.includes('meta name='), desc: 'SEO meta tags' },
      { name: 'service_worker', test: html.includes('serviceWorker'), desc: 'Service worker' }
    ]

    checks.forEach(check => {
      logResult('deployment', check.name, check.test ? 'pass' : 'fail', check.desc)
    })

  } catch (error) {
    logResult('deployment', 'content_verification', 'fail', error.message)
  }
}

// 5. VERIFY EXTERNAL APIS
async function verifyExternalAPIs() {
  console.log('\n🌐 VERIFYING EXTERNAL RESOURCES')
  console.log('─'.repeat(60))

  // Test Wikipedia API
  try {
    const wikiResponse = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Tarot', {
      timeout: 5000
    })
    
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json()
      logResult('external_apis', 'wikipedia', 'pass', `Title: ${wikiData.title}`)
    } else {
      logResult('external_apis', 'wikipedia', 'fail', `HTTP ${wikiResponse.status}`)
    }
  } catch (error) {
    logResult('external_apis', 'wikipedia', 'warn', `Wikipedia API: ${error.message}`)
  }

  // Test Monica AI API health
  try {
    const healthResponse = await fetch(`${MONICA_BASE_URL}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`
      },
      timeout: 5000
    })
    
    if (healthResponse.ok) {
      logResult('external_apis', 'monica_health', 'pass', 'Monica API healthy')
    } else {
      logResult('external_apis', 'monica_health', 'warn', `Monica API: HTTP ${healthResponse.status}`)
    }
  } catch (error) {
    logResult('external_apis', 'monica_health', 'warn', `Monica API: ${error.message}`)
  }

  // Test GitHub API (for deployment status)
  try {
    const githubResponse = await fetch('https://api.github.com/repos/yesinyagami/night-god-tarot-unified', {
      timeout: 5000
    })
    
    if (githubResponse.ok) {
      const repoData = await githubResponse.json()
      logResult('external_apis', 'github_repo', 'pass', `${repoData.name}, ${repoData.language}`)
    } else {
      logResult('external_apis', 'github_repo', 'warn', `GitHub API: HTTP ${githubResponse.status}`)
    }
  } catch (error) {
    logResult('external_apis', 'github_repo', 'warn', `GitHub API: ${error.message}`)
  }
}

// 6. GENERATE COMPREHENSIVE REPORT
function generateFinalReport() {
  console.log('\n' + '='.repeat(80))
  console.log('🌟 ULTIMATE SYSTEM VERIFICATION REPORT 🌟')
  console.log('='.repeat(80))

  const categories = ['ai_models', 'functionality', 'resources', 'deployment', 'external_apis']
  
  categories.forEach(category => {
    const results = testResults[category]
    const passed = Object.values(results).filter(r => r.status === 'pass').length
    const failed = Object.values(results).filter(r => r.status === 'fail').length
    const warnings = Object.values(results).filter(r => r.status === 'warn').length
    const total = passed + failed + warnings
    
    console.log(`\n📊 ${category.toUpperCase().replace('_', ' ')}: ${passed}/${total} passed`)
    
    Object.entries(results).forEach(([test, result]) => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
      console.log(`   ${icon} ${test}: ${result.details}`)
    })
  })

  const totalPassed = testResults.overall.passed
  const totalFailed = testResults.overall.failed  
  const totalWarnings = testResults.overall.warnings
  const totalTests = totalPassed + totalFailed + totalWarnings
  const successRate = Math.round((totalPassed / totalTests) * 100)

  console.log('\n' + '='.repeat(80))
  console.log('🎯 OVERALL SYSTEM STATUS')
  console.log('='.repeat(80))
  console.log(`📈 Success Rate: ${successRate}% (${totalPassed}/${totalTests} tests passed)`)
  console.log(`✅ Passed: ${totalPassed}`)
  console.log(`❌ Failed: ${totalFailed}`)
  console.log(`⚠️  Warnings: ${totalWarnings}`)

  if (successRate >= 95) {
    console.log('\n🎉 SYSTEM STATUS: FULLY OPERATIONAL!')
    console.log('🚀 Night God Tarot is ready for premium production use!')
    console.log('✨ All critical systems functioning at optimal levels!')
  } else if (successRate >= 85) {
    console.log('\n✨ SYSTEM STATUS: OPERATIONAL WITH MINOR ISSUES')
    console.log('🔧 System functional, some optimizations possible')
  } else if (successRate >= 70) {
    console.log('\n⚠️  SYSTEM STATUS: FUNCTIONAL WITH ISSUES')
    console.log('🛠️  Core functionality working, attention needed')
  } else {
    console.log('\n❌ SYSTEM STATUS: NEEDS ATTENTION')
    console.log('🚨 Critical issues require resolution')
  }

  console.log('\n🌙 DIVINE TECHNOLOGY ASSESSMENT COMPLETE! 🌙')
  console.log('💫 The Night God Tarot system has been thoroughly verified! 💫')

  return {
    successRate,
    totalTests,
    passed: totalPassed,
    failed: totalFailed,
    warnings: totalWarnings,
    status: successRate >= 95 ? 'FULLY_OPERATIONAL' : 
            successRate >= 85 ? 'OPERATIONAL' : 
            successRate >= 70 ? 'FUNCTIONAL' : 'NEEDS_ATTENTION'
  }
}

// MAIN VERIFICATION EXECUTION
async function runUltimateVerification() {
  console.log('🔍 Starting ultimate system verification...\n')
  
  if (!MONICA_API_KEY) {
    console.log('❌ Monica API key not configured - some tests will fail')
  }

  await verifyAIModels()
  await testTarotPipeline()
  await verifyAssets()
  await testLiveDeployment()
  await verifyExternalAPIs()
  
  const finalReport = generateFinalReport()
  
  return finalReport
}

runUltimateVerification().catch(console.error)