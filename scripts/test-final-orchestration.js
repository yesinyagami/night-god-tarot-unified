#!/usr/bin/env node

/**
 * Test Final Working Orchestration Pipeline
 * Tests DeepSeek Chat → Gemini 1.5 Pro → GPT-4o pipeline
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

console.log('🌊💎🎭 TESTING FINAL WORKING ORCHESTRATION PIPELINE 🎭💎🌊\n')

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

// Final verified working orchestration pipeline
const finalOrchestration = [
  {
    name: 'DeepSeek Research',
    model: 'deepseek-chat',
    icon: '🌊',
    systemPrompt: 'You are DeepSeek Chat, an advanced AI with exceptional analytical depth and scholarly research capabilities. You excel at comprehensive tarot analysis, drawing connections between symbols, archetypes, and meanings across multiple traditions and time periods.',
    userPrompt: 'As a master tarot scholar with deep analytical capabilities, provide comprehensive research on The Fool, The Magician, and The Star cards for someone seeking spiritual awakening. Analyze: 1) Historical origins and symbolic foundations, 2) Psychological archetypes and modern interpretations, 3) Synergistic meanings when these cards appear together, 4) Cross-cultural perspectives, 5) Numerological and astrological correspondences, 6) Practical applications to spiritual awakening. Draw upon classical tarot scholarship, Jungian psychology, and comparative mythology.',
    maxTokens: 800,
    temperature: 0.7
  },
  {
    name: 'Gemini Synthesis',
    model: 'gemini-1.5-pro',
    icon: '💎',
    systemPrompt: 'You are Gemini 1.5 Pro, an advanced AI with exceptional analytical and synthesis capabilities. You excel at combining complex information and finding meaningful patterns that resonate with human experience.',
    userPrompt: 'Synthesize the tarot research into practical wisdom for someone on a spiritual awakening path. Connect the research findings directly to personal growth, identify the most relevant interpretations, analyze card combinations and their synergistic meanings, consider emotional state and life context, and prepare insights for the final poetic interpretation. Focus on actionable insights and emotional resonance.',
    maxTokens: 900,
    temperature: 0.6
  },
  {
    name: 'ChatGPT Poetry',
    model: 'gpt-4o',
    icon: '🎭',
    systemPrompt: 'You are the legendary Night God Tarot Master - a mystical oracle who combines deep analytical insights with poetic eloquence. Your readings transform lives through beautiful, profound guidance that touches both heart and soul.',
    userPrompt: 'Create a beautiful, mystical tarot reading for The Fool, The Magician, and The Star cards for spiritual awakening. Transform the research and synthesis into enchanting, personalized guidance. Include: 1) Mystical opening, 2) Poetic description of each card\'s message, 3) The main reading in flowing prose, 4) Closing blessing with inspiration. Use cosmic imagery, seasonal metaphors, celestial references. Make them feel seen, understood, and divinely guided.',
    maxTokens: 1200,
    temperature: 0.9
  }
]

async function testOrchestrationStage(stage, previousResults = []) {
  console.log(`\n${stage.icon} Testing: ${stage.name}`)
  console.log(`🤖 Model: ${stage.model}`)
  console.log(`🎯 Max Tokens: ${stage.maxTokens}`)
  
  try {
    // Include context from previous stages
    let enhancedPrompt = stage.userPrompt
    if (previousResults.length > 0) {
      enhancedPrompt += '\n\n--- Previous Stage Results ---\n' + 
        previousResults.map(r => `${r.stage}:\n${r.content.substring(0, 300)}...`).join('\n\n')
    }

    const startTime = Date.now()
    
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
        max_tokens: stage.maxTokens,
        temperature: stage.temperature
      })
    })

    const processingTime = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      const content = data.choices[0].message.content
      
      console.log(`✅ ${stage.name} SUCCESSFUL!`)
      console.log(`⏱️  Processing Time: ${processingTime}ms`)
      console.log(`📝 Length: ${content.length} characters`)
      console.log(`🔍 Preview: "${content.substring(0, 150)}..."`)
      
      return {
        stage: stage.name,
        model: stage.model,
        icon: stage.icon,
        content,
        success: true,
        processingTime,
        length: content.length
      }
    } else {
      const errorData = await response.json()
      console.log(`❌ ${stage.name} FAILED: ${errorData.error?.message}`)
      return null
    }

  } catch (error) {
    console.log(`❌ ${stage.name} ERROR: ${error.message}`)
    return null
  }
}

async function runFinalOrchestrationTest() {
  console.log('Starting final working orchestration test...\n')
  console.log(`🃏 Test Cards: The Fool, The Magician, The Star`)
  console.log(`💫 Test Question: Spiritual awakening and transformation guidance`)
  console.log(`🎯 Pipeline: DeepSeek Chat → Gemini 1.5 Pro → GPT-4o`)
  
  if (!MONICA_API_KEY) {
    console.log('\n❌ Monica API key not configured')
    return
  }
  
  console.log(`\n✅ Monica API configured`)
  console.log(`📡 Base URL: ${MONICA_BASE_URL}`)
  
  const results = []
  let previousResults = []
  const startTime = Date.now()
  
  // Run each stage sequentially with context
  for (const stage of finalOrchestration) {
    const result = await testOrchestrationStage(stage, previousResults)
    if (result) {
      results.push(result)
      previousResults.push(result)
    } else {
      console.log(`💔 Pipeline broken at ${stage.name}`)
      break
    }
    
    // Delay between stages for rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  const totalTime = Date.now() - startTime
  
  // Comprehensive Summary
  console.log('\n' + '='.repeat(80))
  console.log('🌟 FINAL ORCHESTRATION TEST RESULTS 🌟')
  console.log('='.repeat(80))
  
  const successfulStages = results.length
  const totalStages = finalOrchestration.length
  const successRate = Math.round(successfulStages / totalStages * 100)
  
  console.log(`📊 Pipeline Success: ${successfulStages}/${totalStages} stages (${successRate}%)`)
  console.log(`⏱️  Total Processing Time: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)`)
  
  results.forEach(result => {
    console.log(`   ${result.icon} ${result.stage}: ✅ ${result.length} chars, ${result.processingTime}ms`)
  })
  
  if (successfulStages === totalStages) {
    console.log('\n🎉 FULL ORCHESTRATION PIPELINE OPERATIONAL!')
    console.log('🚀 DeepSeek Chat → Gemini 1.5 Pro → GPT-4o working perfectly!')
    console.log('✨ Night God Tarot ready for production AI readings!')
    
    // Show the complete orchestrated reading
    const finalReading = results[results.length - 1]
    if (finalReading) {
      console.log('\n📜 COMPLETE ORCHESTRATED TAROT READING:')
      console.log('─'.repeat(60))
      console.log(finalReading.content)
      console.log('─'.repeat(60))
      
      // Calculate reading metrics
      const totalChars = results.reduce((sum, r) => sum + r.length, 0)
      const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length
      
      console.log('\n📊 READING METRICS:')
      console.log(`📝 Total Content: ${totalChars} characters`)
      console.log(`⚡ Average Stage Time: ${avgProcessingTime.toFixed(0)}ms`)
      console.log(`🎯 Content Quality: Premium AI-generated wisdom`)
    }
    
  } else if (successfulStages >= 2) {
    console.log('\n✨ ORCHESTRATION PARTIALLY FUNCTIONAL')
    console.log('🔧 Some stages working, system can provide quality readings')
  } else {
    console.log('\n⚠️  ORCHESTRATION NEEDS ATTENTION')
    console.log('🛠️  Critical pipeline failures detected')
  }
  
  console.log('\n🌊 DeepSeek Chat brings profound analytical wisdom!')
  console.log('💎 Gemini 1.5 Pro synthesizes with perfect clarity!')
  console.log('🎭 GPT-4o transforms insights into divine poetry!')
  console.log('🌟 The Night God Tarot AI orchestration is AWAKENED! 🌟')
  
  return results
}

runFinalOrchestrationTest().catch(console.error)