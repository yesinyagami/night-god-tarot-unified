#!/usr/bin/env node

/**
 * Test Wikipedia-Enhanced AI Tarot Reading System
 * Combines DeepSeek research with Wikipedia knowledge for ultimate accuracy
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

console.log('📚🌊💎🎭 TESTING WIKIPEDIA-ENHANCED AI ORCHESTRATION 🎭💎🌊📚\n')

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://openapi.monica.im'

// Wikipedia search function
async function searchWikipedia(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    const response = await fetch(searchUrl)
    
    if (response.ok) {
      const data = await response.json()
      return {
        title: data.title,
        extract: data.extract,
        url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
      }
    }
    return null
  } catch (error) {
    console.log(`⚠️  Wikipedia search failed for "${query}": ${error.message}`)
    return null
  }
}

// Enhanced research function with Wikipedia integration
async function getWikipediaResearch(cards) {
  console.log('📚 Gathering Wikipedia research...')
  
  const wikiResults = []
  
  for (const card of cards) {
    console.log(`🔍 Searching Wikipedia for: ${card}`)
    
    // Try different search terms for better results
    const searchTerms = [
      `${card} tarot card`,
      `${card} tarot`,
      card,
      `${card} mythology`,
      `${card} symbolism`
    ]
    
    for (const term of searchTerms) {
      const result = await searchWikipedia(term)
      if (result && result.extract && result.extract.length > 100) {
        wikiResults.push({
          card,
          title: result.title,
          extract: result.extract,
          url: result.url,
          searchTerm: term
        })
        console.log(`✅ Found: ${result.title}`)
        break // Found good result, move to next card
      }
      
      // Small delay between searches
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  console.log(`📊 Wikipedia research complete: ${wikiResults.length}/${cards.length} cards found`)
  return wikiResults
}

// Enhanced orchestration with Wikipedia integration
async function runWikipediaEnhancedOrchestration() {
  console.log('Starting Wikipedia-enhanced tarot reading orchestration...\n')
  
  const testCards = ['The Fool', 'The Magician', 'The Star']
  const testQuestion = 'What guidance do you have for my spiritual awakening and personal transformation?'
  
  console.log(`🃏 Cards: ${testCards.join(', ')}`)
  console.log(`💫 Question: ${testQuestion}`)
  console.log(`🎯 Enhanced Pipeline: Wikipedia Research → DeepSeek Analysis → Gemini Synthesis → GPT-4o Poetry`)
  
  if (!MONICA_API_KEY) {
    console.log('❌ Monica API key not configured')
    return
  }
  
  const startTime = Date.now()
  
  // Stage 0: Wikipedia Research
  console.log('\n📚 Stage 0: Wikipedia Knowledge Gathering...')
  const wikiResearch = await getWikipediaResearch(testCards)
  
  // Compile Wikipedia knowledge
  const wikiKnowledge = wikiResearch.map(r => 
    `**${r.card}** (from ${r.title}):\n${r.extract}\nSource: ${r.url}`
  ).join('\n\n')
  
  // Stage 1: Enhanced DeepSeek Research
  console.log('\n🌊 Stage 1: DeepSeek Analysis with Wikipedia Context...')
  
  const enhancedResearchPrompt = `As a master tarot scholar, analyze The Fool, The Magician, and The Star cards for spiritual awakening guidance. You have access to both traditional tarot knowledge and Wikipedia research data.

WIKIPEDIA RESEARCH CONTEXT:
${wikiKnowledge || 'No additional Wikipedia context found'}

ANALYSIS REQUEST:
Provide comprehensive analysis combining traditional tarot scholarship with the Wikipedia context:
1. Historical origins and symbolic foundations of each card
2. Psychological archetypes and modern interpretations  
3. Synergistic meanings when these cards appear together
4. Cross-cultural perspectives and variations
5. Numerological and astrological correspondences
6. Practical applications to spiritual awakening
7. How the Wikipedia research enhances or confirms traditional meanings

Draw upon classical tarot scholarship, Jungian psychology, comparative mythology, and the Wikipedia research provided.`

  try {
    const researchResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are DeepSeek Chat, an advanced AI scholar with access to both traditional tarot knowledge and external research sources. You excel at synthesizing multiple sources of information into comprehensive analysis.'
          },
          {
            role: 'user',
            content: enhancedResearchPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!researchResponse.ok) {
      throw new Error(`Research stage failed: ${researchResponse.status}`)
    }

    const researchData = await researchResponse.json()
    const researchContent = researchData.choices[0].message.content
    
    console.log('✅ Enhanced research successful!')
    console.log(`📝 Research length: ${researchContent.length} characters`)
    console.log(`🔍 Preview: "${researchContent.substring(0, 150)}..."`)

    // Stage 2: Gemini Synthesis
    console.log('\n💎 Stage 2: Gemini Synthesis...')
    
    const synthesisPrompt = `Synthesize the comprehensive research into practical wisdom for someone on a spiritual awakening path. The research includes both traditional tarot knowledge and Wikipedia context. Transform this into actionable insights and emotional resonance while preparing the foundation for poetic interpretation.

RESEARCH TO SYNTHESIZE:
${researchContent}

Focus on connecting the enhanced research to personal transformation, identifying the most relevant interpretations for spiritual awakening, and preparing poetic elements for the final reading.`

    const synthesisResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemini-1.5-pro',
        messages: [
          {
            role: 'system',
            content: 'You are Gemini 1.5 Pro, specializing in synthesis and pattern recognition. Transform comprehensive research into emotionally resonant wisdom for spiritual seekers.'
          },
          {
            role: 'user',
            content: synthesisPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.6
      })
    })

    if (!synthesisResponse.ok) {
      throw new Error(`Synthesis stage failed: ${synthesisResponse.status}`)
    }

    const synthesisData = await synthesisResponse.json()
    const synthesisContent = synthesisData.choices[0].message.content

    console.log('✅ Synthesis successful!')
    console.log(`📝 Synthesis length: ${synthesisContent.length} characters`)

    // Stage 3: GPT-4o Poetry
    console.log('\n🎭 Stage 3: ChatGPT Divine Poetry...')
    
    const poetryPrompt = `Create a beautiful, mystical tarot reading for The Fool, The Magician, and The Star cards for spiritual awakening. You have access to enhanced research that combines traditional tarot wisdom with Wikipedia knowledge, plus expert synthesis.

ENHANCED RESEARCH & SYNTHESIS:
${researchContent.substring(0, 800)}...

${synthesisContent}

Create an enchanting, personalized reading with:
1. Mystical opening that acknowledges the depth of research
2. Poetic description of each card's divine message
3. Main reading in flowing, cosmic prose
4. Closing blessing with actionable inspiration

Use celestial imagery, seasonal metaphors, and cosmic references. Make the reading feel both scholarly accurate and divinely inspired.`

    const poetryResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are the legendary Night God Tarot Master with access to comprehensive research from multiple sources. Transform scholarly knowledge into divine, poetic guidance that touches the soul.'
          },
          {
            role: 'user',
            content: poetryPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.9
      })
    })

    if (!poetryResponse.ok) {
      throw new Error(`Poetry stage failed: ${poetryResponse.status}`)
    }

    const poetryData = await poetryResponse.json()
    const poetryContent = poetryData.choices[0].message.content

    const totalTime = Date.now() - startTime

    console.log('✅ Divine poetry successful!')
    console.log(`📝 Poetry length: ${poetryContent.length} characters`)

    // Final Results
    console.log('\n' + '='.repeat(80))
    console.log('🌟 WIKIPEDIA-ENHANCED ORCHESTRATION RESULTS 🌟')
    console.log('='.repeat(80))
    console.log(`📚 Wikipedia Sources: ${wikiResearch.length} cards researched`)
    console.log(`🌊 DeepSeek Research: ${researchContent.length} chars of enhanced analysis`)
    console.log(`💎 Gemini Synthesis: ${synthesisContent.length} chars of wisdom distillation`)  
    console.log(`🎭 GPT-4o Poetry: ${poetryContent.length} chars of divine reading`)
    console.log(`⏱️  Total Processing: ${(totalTime/1000).toFixed(1)}s`)
    console.log(`📊 Total Content: ${(researchContent.length + synthesisContent.length + poetryContent.length)} characters`)

    console.log('\n📜 WIKIPEDIA-ENHANCED TAROT READING:')
    console.log('─'.repeat(60))
    console.log(poetryContent)
    console.log('─'.repeat(60))

    console.log('\n🎉 WIKIPEDIA-ENHANCED ORCHESTRATION OPERATIONAL!')
    console.log('📚 External knowledge sources integrated successfully!')
    console.log('🚀 Most comprehensive AI tarot readings ever created!')
    console.log('✨ Combining human knowledge with AI wisdom for divine guidance!')

  } catch (error) {
    console.error(`❌ Orchestration failed: ${error.message}`)
  }
}

runWikipediaEnhancedOrchestration().catch(console.error)