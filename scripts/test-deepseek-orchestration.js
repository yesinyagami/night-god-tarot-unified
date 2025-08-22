#!/usr/bin/env node

/**
 * Test DeepSeek Orchestration Pipeline
 * Tests the updated orchestration with DeepSeek → Gemini → ChatGPT pipeline
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

console.log('🌊✨ TESTING DEEPSEEK AI ORCHESTRATION PIPELINE ✨🌊\n')

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

// Updated 3-stage orchestration: DeepSeek → Gemini → ChatGPT
const orchestrationStages = [
  {
    name: 'DeepSeek Research',
    model: 'deepseek-v3',
    icon: '🌊',
    systemPrompt: 'You are DeepSeek, an advanced AI with exceptional analytical depth and scholarly research capabilities. You excel at comprehensive tarot analysis, drawing connections between symbols, archetypes, and meanings across multiple traditions and time periods.',
    userPrompt: 'As a master tarot scholar with deep analytical capabilities, analyze The Fool, The Magician, and The Star cards for someone seeking spiritual awakening. Provide comprehensive research on historical origins, psychological archetypes, synergistic meanings, cross-cultural perspectives, and practical applications. Draw upon classical tarot scholarship, Jungian psychology, and comparative mythology.'
  },
  {
    name: 'Gemini Synthesis', 
    model: 'gemini-1.5-pro',
    icon: '💎',
    systemPrompt: 'You are Gemini, an advanced AI with exceptional analytical and synthesis capabilities. You excel at combining complex information and finding meaningful patterns that resonate with human experience.',
    userPrompt: 'Based on comprehensive tarot research, synthesize the meanings of The Fool, The Magician, and The Star cards for someone on a spiritual awakening path. Connect the research findings directly to personal growth, identify actionable insights, and prepare the foundation for poetic interpretation.'
  },
  {
    name: 'ChatGPT Poetry',
    model: 'gpt-4o',
    icon: '🎭', 
    systemPrompt: 'You are the legendary Night God Tarot Master - a mystical oracle who combines deep analytical insights with poetic eloquence. Your readings transform lives through beautiful, profound guidance that touches both heart and soul.',
    userPrompt: 'Create a beautiful, mystical tarot reading for The Fool, The Magician, and The Star cards for spiritual awakening. Transform the research and analysis into enchanting, personalized guidance with cosmic imagery, practical wisdom, and an inspiring conclusion. Use elegant language that flows like poetry while delivering profound insights.'
  }
]

async function testOrchestrationStage(stage, previousResults = []) {
  console.log(`\n${stage.icon} Stage: ${stage.name}`)
  console.log(`🤖 Model: ${stage.model}`)
  
  try {
    // Include context from previous stages
    let enhancedPrompt = stage.userPrompt
    if (previousResults.length > 0) {
      enhancedPrompt += '\n\nPrevious stage insights:\n' + 
        previousResults.map(r => `${r.stage}: ${r.content.substring(0, 200)}...`).join('\n')
    }

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
            content: stage.systemPrompt
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: stage.name.includes('Poetry') ? 1000 : 800,
        temperature: stage.name.includes('Poetry') ? 0.9 : 0.7
      })
    })

    if (response.ok) {
      const data = await response.json()
      const content = data.choices[0].message.content
      console.log(`✅ ${stage.name} successful`)
      console.log(`📝 Length: ${content.length} characters`)
      console.log(`🔍 Preview: "${content.substring(0, 120)}..."`)
      
      return {
        stage: stage.name,
        model: stage.model,
        icon: stage.icon,
        content,
        success: true,
        processingTime: Date.now() - Date.now()
      }
    } else {
      const errorData = await response.json()
      console.log(`❌ ${stage.name} failed: ${errorData.error?.message}`)
      return null
    }

  } catch (error) {
    console.log(`❌ ${stage.name} error: ${error.message}`)
    return null
  }
}

async function runFullOrchestrationTest() {
  console.log('Starting DeepSeek → Gemini → ChatGPT orchestration test...\n')
  
  if (!MONICA_API_KEY) {
    console.log('❌ Monica API key not configured')
    return
  }
  
  console.log(`✅ Monica API configured`)
  console.log(`📡 Base URL: ${MONICA_BASE_URL}`)
  console.log(`🎴 Test Cards: The Fool, The Magician, The Star`)
  console.log(`💫 Test Question: Spiritual awakening guidance`)
  
  const results = []
  let previousResults = []
  
  // Run each stage sequentially, building on previous results
  for (const stage of orchestrationStages) {
    const result = await testOrchestrationStage(stage, previousResults)
    if (result) {
      results.push(result)
      previousResults.push(result)
    }
    
    // Delay between stages
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('🌟 DEEPSEEK ORCHESTRATION TEST SUMMARY 🌟')
  console.log('='.repeat(70))
  
  const successfulStages = results.length
  const totalStages = orchestrationStages.length
  const successRate = Math.round(successfulStages / totalStages * 100)
  
  console.log(`📊 Successful Stages: ${successfulStages}/${totalStages} (${successRate}%)`)
  
  results.forEach(result => {
    console.log(`   ${result.icon} ${result.stage}: ✅ Operational`)
  })
  
  if (successfulStages === totalStages) {
    console.log('\n🎉 FULL DEEPSEEK ORCHESTRATION OPERATIONAL!')
    console.log('🚀 DeepSeek → Gemini → ChatGPT pipeline working perfectly!')
    console.log('✨ Users now get comprehensive AI-powered tarot readings!')
    
    // Show final reading if available
    const finalResult = results.find(r => r.stage === 'ChatGPT Poetry')
    if (finalResult) {
      console.log('\n📜 SAMPLE FINAL READING:')
      console.log('─'.repeat(50))
      console.log(finalResult.content.substring(0, 400) + '...')
      console.log('─'.repeat(50))
    }
    
  } else if (successfulStages >= 2) {
    console.log('\n✨ ORCHESTRATION MOSTLY FUNCTIONAL')
    console.log('🔧 Minor adjustments may enhance performance')
  } else {
    console.log('\n⚠️  ORCHESTRATION NEEDS ATTENTION')
    console.log('🛠️  Please resolve stage failures')
  }
  
  console.log('\n🌊 DeepSeek brings profound analytical depth to divine wisdom! 🌊')
  console.log('💫 The Night God Tarot orchestration is awakened! 💫')
}

runFullOrchestrationTest().catch(console.error)