#!/usr/bin/env node

/**
 * Test All Available Monica AI Models
 * Discovers which models work and finds the best alternatives
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

console.log('🤖✨ TESTING ALL AVAILABLE MONICA AI MODELS ✨🤖\n')

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

// Comprehensive list of potential models to test
const modelsToTest = [
  // DeepSeek variants
  { name: 'DeepSeek V3', endpoint: 'deepseek-v3', category: 'deepseek' },
  { name: 'DeepSeek V2.5', endpoint: 'deepseek-v2.5', category: 'deepseek' },
  { name: 'DeepSeek Chat', endpoint: 'deepseek-chat', category: 'deepseek' },
  { name: 'DeepSeek Coder', endpoint: 'deepseek-coder', category: 'deepseek' },
  
  // Claude variants
  { name: 'Claude-3.5 Sonnet', endpoint: 'claude-3-5-sonnet-20241022', category: 'claude' },
  { name: 'Claude-3.5 Sonnet Latest', endpoint: 'claude-3-5-sonnet-latest', category: 'claude' },
  { name: 'Claude-3 Opus', endpoint: 'claude-3-opus-20240229', category: 'claude' },
  { name: 'Claude-3 Sonnet', endpoint: 'claude-3-sonnet-20240229', category: 'claude' },
  
  // GPT variants  
  { name: 'GPT-4o', endpoint: 'gpt-4o', category: 'openai' },
  { name: 'GPT-4o Mini', endpoint: 'gpt-4o-mini', category: 'openai' },
  { name: 'GPT-4 Turbo', endpoint: 'gpt-4-turbo', category: 'openai' },
  
  // Gemini variants
  { name: 'Gemini 1.5 Pro', endpoint: 'gemini-1.5-pro', category: 'google' },
  { name: 'Gemini 1.5 Pro Latest', endpoint: 'gemini-1.5-pro-latest', category: 'google' },
  { name: 'Gemini 1.5 Flash', endpoint: 'gemini-1.5-flash', category: 'google' },
  
  // Other models
  { name: 'Llama 3.1 405B', endpoint: 'llama-3.1-405b-instruct', category: 'meta' },
  { name: 'Llama 3.1 70B', endpoint: 'llama-3.1-70b-instruct', category: 'meta' },
  { name: 'Qwen 2.5 72B', endpoint: 'qwen-2.5-72b-instruct', category: 'qwen' },
  { name: 'Qwen 2.5 Coder', endpoint: 'qwen-2.5-coder-32b-instruct', category: 'qwen' },
  
  // Research models
  { name: 'Perplexity Sonar', endpoint: 'perplexity-sonar-huge', category: 'perplexity' },
  { name: 'Perplexity 7B', endpoint: 'perplexity-7b-online', category: 'perplexity' },
]

async function testModel(model) {
  console.log(`\n🧪 Testing: ${model.name}`)
  console.log(`📡 Endpoint: ${model.endpoint}`)
  
  try {
    const response = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.endpoint,
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with just "OK" to confirm you are working.'
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      }),
      timeout: 15000
    })

    if (response.ok) {
      const data = await response.json()
      const content = data.choices[0].message.content
      console.log(`✅ ${model.name}: WORKING`)
      console.log(`📝 Response: "${content}"`)
      return { ...model, status: 'working', response: content }
    } else {
      const errorData = await response.json()
      console.log(`❌ ${model.name}: FAILED`)
      console.log(`📝 Error: ${errorData.error?.message || 'Unknown error'}`)
      return { ...model, status: 'failed', error: errorData.error?.message }
    }

  } catch (error) {
    console.log(`❌ ${model.name}: ERROR`)
    console.log(`📝 Error: ${error.message}`)
    return { ...model, status: 'error', error: error.message }
  }
}

async function runModelDiscovery() {
  console.log('Starting comprehensive Monica AI model discovery...\n')
  
  if (!MONICA_API_KEY) {
    console.log('❌ Monica API key not configured')
    return
  }
  
  console.log(`✅ Monica API configured`)
  console.log(`📡 Base URL: ${MONICA_BASE_URL}`)
  console.log(`🧪 Testing ${modelsToTest.length} models...`)
  
  const results = []
  
  // Test all models with short delays
  for (const model of modelsToTest) {
    const result = await testModel(model)
    results.push(result)
    
    // Short delay between tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Categorize results
  const workingModels = results.filter(r => r.status === 'working')
  const failedModels = results.filter(r => r.status === 'failed')
  const errorModels = results.filter(r => r.status === 'error')
  
  // Summary by category
  console.log('\n' + '='.repeat(80))
  console.log('🌟 MONICA AI MODEL DISCOVERY SUMMARY 🌟')
  console.log('='.repeat(80))
  
  console.log(`\n✅ WORKING MODELS (${workingModels.length})`)
  console.log('─'.repeat(40))
  const categories = {}
  workingModels.forEach(model => {
    if (!categories[model.category]) categories[model.category] = []
    categories[model.category].push(model)
  })
  
  Object.entries(categories).forEach(([category, models]) => {
    console.log(`\n🔷 ${category.toUpperCase()}:`)
    models.forEach(model => {
      console.log(`   ✅ ${model.name} (${model.endpoint})`)
    })
  })
  
  if (failedModels.length > 0) {
    console.log(`\n❌ FAILED MODELS (${failedModels.length})`)
    console.log('─'.repeat(40))
    failedModels.forEach(model => {
      console.log(`   ❌ ${model.name}: ${model.error}`)
    })
  }
  
  if (errorModels.length > 0) {
    console.log(`\n🚨 ERROR MODELS (${errorModels.length})`)
    console.log('─'.repeat(40))
    errorModels.forEach(model => {
      console.log(`   🚨 ${model.name}: ${model.error}`)
    })
  }
  
  // Recommendations for orchestration
  console.log('\n🎯 ORCHESTRATION RECOMMENDATIONS')
  console.log('─'.repeat(40))
  
  const researchModels = workingModels.filter(m => 
    m.category === 'claude' || m.category === 'deepseek' || m.category === 'qwen'
  )
  const analysisModels = workingModels.filter(m => 
    m.category === 'google' || m.category === 'claude'
  )
  const poetryModels = workingModels.filter(m => 
    m.category === 'openai' || m.category === 'claude'
  )
  
  console.log(`🔍 Research Stage: ${researchModels.length} options available`)
  if (researchModels.length > 0) {
    console.log(`   Recommended: ${researchModels[0].name}`)
  }
  
  console.log(`🧠 Analysis Stage: ${analysisModels.length} options available`)
  if (analysisModels.length > 0) {
    console.log(`   Recommended: ${analysisModels[0].name}`)
  }
  
  console.log(`🎭 Poetry Stage: ${poetryModels.length} options available`)
  if (poetryModels.length > 0) {
    console.log(`   Recommended: ${poetryModels[0].name}`)
  }
  
  // Export working models configuration
  console.log('\n📋 WORKING MODELS CONFIGURATION')
  console.log('─'.repeat(40))
  console.log('Copy this to update your orchestrator:')
  console.log('')
  console.log('const workingModels = {')
  workingModels.forEach(model => {
    const key = model.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    console.log(`  ${key}: '${model.endpoint}',`)
  })
  console.log('}')
  
  console.log(`\n🎉 Model discovery complete! ${workingModels.length} models ready for divine wisdom!`)
}

runModelDiscovery().catch(console.error)