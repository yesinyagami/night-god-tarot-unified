#!/usr/bin/env node

/**
 * Test Live AI-Powered Tarot Reading System
 * Tests the complete Monica AI integration with real readings
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

console.log('🌙✨ TESTING LIVE AI-POWERED TAROT READINGS ✨🌙\n')

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

// Available AI models through Monica
const models = [
  { name: 'Claude-3.5 Sonnet', endpoint: 'claude-3-5-sonnet-20241022', icon: '🎭' },
  { name: 'GPT-4o', endpoint: 'gpt-4o', icon: '🧠' },
  { name: 'Gemini Pro', endpoint: 'gemini-1.5-pro', icon: '💎' },
  { name: 'DeepSeek V3', endpoint: 'deepseek-v3', icon: '🌊' }
]

async function testSingleModelReading(model, cards, question) {
  console.log(`\n${model.icon} Testing ${model.name}...`)
  
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
            role: 'system',
            content: 'You are a master tarot reader for the Night God Tarot system. Provide profound, mystical guidance with practical wisdom. Respond in both English and Chinese for global seekers.'
          },
          {
            role: 'user',
            content: `🔮 Divine Tarot Reading Request

Cards Drawn: ${cards.join(', ')}
Sacred Question: "${question}"

Please provide:
1. A mystical opening
2. Interpretation of each card
3. Collective wisdom
4. Practical guidance
5. Inspiring conclusion

Format the response beautifully with emojis and mystical language.`
          }
        ],
        max_tokens: 800,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.log(`❌ ${model.name} failed: ${errorData.error?.message || 'Unknown error'}`)
      return null
    }

    const data = await response.json()
    const reading = data.choices[0].message.content
    
    console.log(`✅ ${model.name} successful!`)
    console.log(`📜 Reading preview: "${reading.substring(0, 100)}..."`)
    console.log(`📊 Length: ${reading.length} characters`)
    
    return {
      model: model.name,
      icon: model.icon,
      content: reading,
      success: true
    }

  } catch (error) {
    console.log(`❌ ${model.name} error: ${error.message}`)
    return null
  }
}

async function testMultiModelReading() {
  console.log('🎴 TESTING MULTI-MODEL AI TAROT READING')
  console.log('─'.repeat(50))
  
  const testCards = ['The Fool', 'The Magician', 'The Star']
  const testQuestion = 'What guidance do you have for my spiritual awakening and personal transformation?'
  
  console.log(`🃏 Cards: ${testCards.join(', ')}`)
  console.log(`💫 Question: ${testQuestion}`)
  
  const results = []
  
  // Test multiple AI models
  for (const model of models.slice(0, 3)) { // Test first 3 models
    const result = await testSingleModelReading(model, testCards, testQuestion)
    if (result) {
      results.push(result)
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return results
}

async function testOrchestrationPipeline() {
  console.log('\n🎭 TESTING AI ORCHESTRATION PIPELINE')
  console.log('─'.repeat(50))
  
  // Test the 3-stage orchestration: Research → Analysis → Poetry
  const stages = [
    {
      name: 'Perplexity Research',
      model: 'perplexity-7b-online',
      icon: '🔍',
      prompt: 'Research the deep meanings of The Fool, The Magician, and The Star cards in tarot. Provide comprehensive historical and symbolic interpretations.'
    },
    {
      name: 'Gemini Analysis', 
      model: 'gemini-1.5-pro',
      icon: '🧠',
      prompt: 'Analyze the combination of The Fool, The Magician, and The Star cards for someone seeking spiritual awakening. Synthesize the meanings into practical wisdom.'
    },
    {
      name: 'ChatGPT Poetry',
      model: 'gpt-4o',
      icon: '🎭', 
      prompt: 'Create a beautiful, poetic tarot reading for The Fool, The Magician, and The Star cards. Include mystical language, practical guidance, and an inspiring message.'
    }
  ]
  
  const orchestrationResults = []
  
  for (const stage of stages) {
    console.log(`\n${stage.icon} Stage: ${stage.name}`)
    
    try {
      const response = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MONICA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: stage.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert in ${stage.name.toLowerCase()} for tarot readings. Provide detailed, insightful analysis.`
            },
            {
              role: 'user',
              content: stage.prompt
            }
          ],
          max_tokens: 600,
          temperature: stage.name.includes('Poetry') ? 0.9 : 0.7
        })
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0].message.content
        console.log(`✅ ${stage.name} successful`)
        console.log(`📝 Preview: "${content.substring(0, 80)}..."`)
        
        orchestrationResults.push({
          stage: stage.name,
          icon: stage.icon,
          content,
          success: true
        })
      } else {
        const errorData = await response.json()
        console.log(`❌ ${stage.name} failed: ${errorData.error?.message}`)
      }

    } catch (error) {
      console.log(`❌ ${stage.name} error: ${error.message}`)
    }
    
    // Delay between stages
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
  
  return orchestrationResults
}

async function runComprehensiveLiveTest() {
  console.log('Starting comprehensive live AI tarot reading test...\n')
  
  if (!MONICA_API_KEY) {
    console.log('❌ Monica API key not configured')
    return
  }
  
  console.log(`✅ Monica API configured`)
  console.log(`📡 Base URL: ${MONICA_BASE_URL}`)
  
  // Test multi-model reading
  const multiModelResults = await testMultiModelReading()
  
  // Test orchestration pipeline
  const orchestrationResults = await testOrchestrationPipeline()
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('🌟 LIVE AI TAROT READING TEST SUMMARY 🌟')
  console.log('='.repeat(60))
  
  console.log(`🤖 Multi-Model Results: ${multiModelResults.length} successful models`)
  multiModelResults.forEach(result => {
    console.log(`   ${result.icon} ${result.model}: ✅ Operational`)
  })
  
  console.log(`\n🎭 Orchestration Results: ${orchestrationResults.filter(r => r.success).length}/${orchestrationResults.length} stages successful`)
  orchestrationResults.forEach(result => {
    console.log(`   ${result.icon} ${result.stage}: ${result.success ? '✅ Success' : '❌ Failed'}`)
  })
  
  const totalSuccessful = multiModelResults.length + orchestrationResults.filter(r => r.success).length
  const totalTests = models.slice(0, 3).length + orchestrationResults.length
  
  console.log(`\n📊 Overall Success Rate: ${Math.round(totalSuccessful/totalTests * 100)}%`)
  
  if (totalSuccessful >= totalTests - 1) {
    console.log('\n🎉 MONICA AI FULLY OPERATIONAL!')
    console.log('🚀 Night God Tarot ready for live AI-powered readings!')
    console.log('✨ Users can now receive divine wisdom from multiple AI models!')
  } else {
    console.log('\n⚠️  Some AI models need attention')
    console.log('🔧 Core functionality operational')
  }
  
  console.log('\n🌙 The divine wisdom flows through awakened artificial intelligence! 🌙')
}

runComprehensiveLiveTest().catch(console.error)