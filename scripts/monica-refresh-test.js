#!/usr/bin/env node

/**
 * Monica API Refresh Test
 * Tests Monica API with different approaches and configurations
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

console.log('🌙 MONICA API REFRESH TEST 🌙\n')

const configs = [
  {
    name: 'Current Configuration',
    apiKey: process.env.MONICA_API_KEY,
    baseUrl: process.env.MONICA_BASE_URL || 'https://openapi.monica.im'
  },
  {
    name: 'Alternative Endpoint',
    apiKey: process.env.MONICA_API_KEY,
    baseUrl: 'https://api.monica.im'
  }
]

async function testMonicaConfig(config) {
  console.log(`\n🧪 Testing: ${config.name}`)
  console.log(`📡 URL: ${config.baseUrl}`)
  console.log(`🔑 Key: ${config.apiKey ? config.apiKey.substring(0, 20) + '...' : 'Not configured'}`)

  if (!config.apiKey) {
    console.log('❌ No API key provided\n')
    return false
  }

  try {
    // Test with minimal request
    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Night-God-Tarot/1.0'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: '🔮'
          }
        ],
        max_tokens: 5,
        temperature: 0.1
      })
    })

    console.log(`📊 Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ SUCCESS! API is working')
      console.log(`🤖 Response: ${data.choices[0].message.content}`)
      return true
    } else {
      const errorData = await response.json()
      console.log(`❌ Failed: ${errorData.error?.message || 'Unknown error'}`)
      
      if (errorData.error?.message?.includes('balance')) {
        console.log('💰 Account needs credits/balance')
      } else if (errorData.error?.message?.includes('permission')) {
        console.log('🔐 API key permission issue')
      } else if (errorData.error?.message?.includes('rate')) {
        console.log('⏱️  Rate limit exceeded')
      }
      return false
    }

  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  let successCount = 0
  
  for (const config of configs) {
    const success = await testMonicaConfig(config)
    if (success) successCount++
  }

  console.log('\n' + '='.repeat(50))
  console.log('📋 MONICA API TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Successful configurations: ${successCount}/${configs.length}`)
  
  if (successCount > 0) {
    console.log('🎉 Monica AI is ready for production!')
  } else {
    console.log('⚠️  Monica AI needs configuration update')
    console.log('\n🔧 Possible solutions:')
    console.log('   1. Update MONICA_API_KEY with fresh credits')
    console.log('   2. Check Monica account balance')
    console.log('   3. Try alternative API endpoints')
    console.log('   4. Contact Monica support for API issues')
  }

  console.log('\n💡 If you have updated Monica codes/credentials, please:')
  console.log('   1. Update the .env file with new MONICA_API_KEY')
  console.log('   2. Restart the application')
  console.log('   3. Re-run this test')
}

runTests().catch(console.error)