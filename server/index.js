#!/usr/bin/env node

/**
 * Night God Tarot API Server
 * Express server for backend API endpoints and services
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import cardsRoutes from './routes/cards.js';
import readingsRoutes from './routes/readings.js';
import paymentsRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import apiKeysRoutes from './routes/apiKeys.js';
import consentRoutes from './routes/consent.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';
import { logRequest } from './middleware/logging.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONICA_API_KEY', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName] === 'your-monica-api-key-here' || process.env[varName] === 'your-jwt-secret-here-minimum-32-characters');

if (missingVars.length > 0) {
  console.error('❌ Missing or placeholder environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📋 Please configure these in your .env file or environment variables');
  console.error('💡 For development, copy .env.example to .env and fill in real values');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1); // Exit in production if missing critical vars
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://openapi.monica.im", "https://api.openweathermap.org", "https://newsapi.org", "https://ipinfo.io", "http://ip-api.com", "https://api.ipgeolocation.io", "https://api.currentsapi.services"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logRequest);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Monica AI specific rate limiter - UNLIMITED MODE
const monicaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10000, // UNLIMITED - drastically increased for your unlimited plan
  message: 'Request limit reached. Please try again in a moment.',
  skip: () => process.env.MONICA_UNLIMITED_MODE === 'true', // Skip rate limiting entirely
});

app.use('/api/ai', monicaLimiter);

// Static files
app.use('/uploads', express.static(join(__dirname, '../uploads')));
app.use('/assets', express.static(join(__dirname, '../public/assets')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/keys', apiKeysRoutes);
app.use('/api/consent', consentRoutes);

// Monica AI proxy endpoint
app.post('/api/ai/chat', authenticateToken, async (req, res, next) => {
  try {
    const { messages, model = 'claude-3-5-sonnet-20241022' } = req.body;
    
    const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Monica AI Chat API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        hasApiKey: !!process.env.MONICA_API_KEY
      });
      throw new Error(`Monica API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Enhanced Tarot reading endpoint with unlimited Monica AI
app.post('/api/readings/perform', async (req, res, next) => {
  try {
    const { cards, question, userId, preferences, useAdvanced = true, language = 'zh' } = req.body;
    
    // Validate input
    if (!cards || cards.length === 0) {
      return res.status(400).json({ error: 'No cards selected' });
    }

    // Create reading record
    const reading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: userId || 'anonymous',
      cards,
      question,
      preferences,
      timestamp: new Date(),
    };

    
    if (useAdvanced && process.env.MONICA_UNLIMITED_MODE === 'true') {
      // Multi-language prompts for different cultural contexts
      const languagePrompts = {
        zh: {
          prompt: `
🌟 夜神塔羅終極解讀 🌟

抽到的牌卡：${cards.map(c => `${c.name} (${c.description || '神聖轉化之牌'})`).join(', ')}
問卜者的問題："${question || '宇宙有什麼指引給我？'}"

作為傳奇夜神塔羅大師，請提供全面的解讀：

1. 🌊 集體智慧 (宇宙法則與古老象徵)
2. 🧠 個人分析 (與問卜者生活的直接關聯)
3. ⚖️ 智慧整合 (實用指引與可行洞察)
4. 🎭 詩意昇華 (美麗、啟發性的神聖真理表達)

以流暢的神秘敘述來構築，觸動靈魂並提供明確方向。
運用宇宙意象、季節隱喻，如同直接傳達神聖智慧般。
          `,
          system: '你是夜神塔羅大師，精通中華文化與塔羅智慧，用優美的中文為問卜者提供深刻的靈性指引。'
        },
        en: {
          prompt: `
🌟 ULTIMATE NIGHT GOD TAROT READING 🌟

Cards Drawn: ${cards.map(c => `${c.name} (${c.description || 'Sacred card of transformation'})`).join(', ')}
Seeker's Question: "${question || 'What guidance does the universe have for me?'}"

As the legendary Night God Tarot Master, provide a comprehensive reading with:

1. 🌊 COLLECTIVE WISDOM (Universal patterns and ancient symbolism)
2. 🧠 PERSONAL ANALYSIS (Direct relevance to the seeker's life)
3. ⚖️ WISDOM INTEGRATION (Practical guidance and actionable insights)
4. 🎭 POETIC SUBLIMATION (Beautiful, inspiring expression of divine truth)

Structure as a flowing, mystical narrative that touches the soul and provides clear direction.
Use cosmic imagery, seasonal metaphors, and speak as if directly channeling divine wisdom.
          `,
          system: 'You are the Night God Tarot Master, combining Western mystical wisdom with tarot knowledge to provide profound spiritual guidance in eloquent English.'
        },
        ja: {
          prompt: `
🌟 ナイトゴッドタロット究極のリーディング 🌟

引いたカード：${cards.map(c => `${c.name} (${c.description || '神聖な変容のカード'})`).join(', ')}
探求者の質問：「${question || '宇宙は私にどんな導きをくれますか？'}」

伝説のナイトゴッドタロットマスターとして、包括的なリーディングを提供してください：

1. 🌊 集合的知恵 (宇宙の法則と古代の象徴)
2. 🧠 個人的分析 (探求者の人生との直接的な関連)
3. ⚖️ 知恵の統合 (実践的な指導と実行可能な洞察)
4. 🎭 詩的昇華 (神聖な真理の美しく、インスピレーションに満ちた表現)

魂に触れ、明確な方向性を提供する流れるような神秘的な物語として構成してください。
宇宙のイメージ、季節の比喩を使い、神聖な知恵を直接伝達するかのように語ってください。
          `,
          system: 'あなたはナイトゴッドタロットマスターです。日本の精神文化とタロットの知恵を組み合わせ、美しい日本語で深い霊的指導を提供します。'
        }
      };
      
      const languageConfig = languagePrompts[language] || languagePrompts.zh;
      const orchestrationPrompt = languageConfig.prompt;
      

      // Parallel multi-model approach for fastest results
      const modelPromises = [
        // GPT-4o for poetic expression
        fetch('https://openapi.monica.im/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: languageConfig.system
              },
              {
                role: 'user',
                content: orchestrationPrompt
              }
            ],
            max_tokens: 3000,
            temperature: 0.9,
          }),
        }),
        
        // Claude for deep analysis (backup)
        fetch('https://openapi.monica.im/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            messages: [
              {
                role: 'system',
                content: languageConfig.system
              },
              {
                role: 'user',
                content: orchestrationPrompt
              }
            ],
            max_tokens: 2500,
            temperature: 0.8,
          }),
        })
      ];

      try {
        const responses = await Promise.allSettled(modelPromises);
        let interpretation = null;
        let model = 'fallback';

        // Use the first successful response
        for (let i = 0; i < responses.length; i++) {
          if (responses[i].status === 'fulfilled' && responses[i].value.ok) {
            const data = await responses[i].value.json();
            interpretation = data.choices[0].message.content;
            model = i === 0 ? 'gpt-4o' : 'claude-3-5-sonnet';
            break;
          }
        }

        if (interpretation) {
          return res.json({
            ...reading,
            interpretation,
            model,
            language,
            advanced: true,
            unlimited: true,
            success: true,
          });
        }
      } catch (error) {
        console.error('Advanced AI orchestration failed:', error);
      }
    }

    // Standard single-model approach or fallback
    const standardPrompt = `
      Perform a mystical tarot reading:
      Cards: ${cards.map(c => c.name).join(', ')}
      Question: ${question || 'General guidance'}
      
      Provide deep insights in these areas:
      1. Collective Wisdom - Universal patterns and meanings
      2. Personal Analysis - Direct relevance to the question
      3. Wisdom Integration - Practical guidance
      4. Poetic Expression - Beautiful, inspiring delivery
      
      Write as a mystical oracle with poetic language and profound insights.
    `;

    const aiResponse = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'system',
            content: 'You are a mystical tarot reader providing deep, insightful guidance with poetic eloquence.',
          },
          {
            role: 'user',
            content: standardPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Monica AI API Error:', {
        status: aiResponse.status,
        statusText: aiResponse.statusText,
        error: errorText,
        hasApiKey: !!process.env.MONICA_API_KEY,
        unlimited: process.env.MONICA_UNLIMITED_MODE === 'true'
      });
      
      // Enhanced fallback with card-specific insights in multiple languages
      const cardInsights = cards.map(card => {
        const insights = {
          zh: {
            'The Fool': '全新的開始正等待著您，充滿無限潛能',
            'The Magician': '您擁有實現願望所需的一切工具',
            'The High Priestess': '相信您的直覺和內在智慧',
            'The Empress': '豐盛與創造力在您的生活中流動',
            'The Emperor': '結構與領導力指引您的道路'
          },
          en: {
            'The Fool': 'New beginnings await you with infinite potential',
            'The Magician': 'You have all the tools needed to manifest your desires',
            'The High Priestess': 'Trust your intuition and inner wisdom',
            'The Empress': 'Abundance and creativity flow through your life',
            'The Emperor': 'Structure and leadership guide your path'
          },
          ja: {
            'The Fool': '無限の可能性を持つ新しい始まりがあなたを待っています',
            'The Magician': 'あなたには願いを実現するためのすべてのツールがあります',
            'The High Priestess': 'あなたの直感と内なる知恵を信じてください',
            'The Empress': '豊かさと創造性があなたの人生に流れています',
            'The Emperor': '構造とリーダーシップがあなたの道を導きます'
          }
        };
        const langInsights = insights[language] || insights.zh;
        return langInsights[card.name] || (
          language === 'zh' ? '這張神聖的牌為您的旅程帶來神聖指引' :
          language === 'ja' ? 'この神聖なカードがあなたの旅に神聖な導きをもたらします' :
          'This sacred card brings divine guidance to your journey'
        );
      });

      // Multi-language fallback interpretations
      const fallbackInterpretations = {
        zh: `
🌟 **夜神塔羅神聖指引** 🌟

宇宙力量已經對齊，通過神聖的牌卡為您帶來深刻智慧：**${cards.map(c => c.name).join('、')}**。

✨ **集體智慧：**
${cardInsights.join('。')}。這些古老的符號訴說著轉化、成長，以及命運與自由意志之間永恆的舞蹈。

🔮 **個人分析：**
您的問題「${question}」與宇宙模式深度共鳴。牌卡暗示您正處於重要的十字路口，內在智慧與外在行動必須對齊。

⚖️ **智慧整合：**
${cardInsights.length > 1 ? '這些牌卡的組合' : '這張牌'}鼓勵您相信生命的神聖時機。採取靈感行動，同時保持對宇宙微妙指引的開放。

🎭 **詩意昇華：**
如同星辰在無限天空中編織故事，您的靈魂旅程以完美時機展開。每一步、每一息、每一個選擇都是您成為過程中壯麗織錦的一部分。

*由夜神塔羅AI神諭以愛傳達*
        `,
        en: `
🌟 **Divine Guidance from the Night God Tarot** 🌟

The cosmic forces have aligned to bring you profound wisdom through the sacred cards: **${cards.map(c => c.name).join(', ')}**.

✨ **Collective Wisdom:**
${cardInsights.join('. ')}. These ancient symbols speak of transformation, growth, and the eternal dance between destiny and free will.

🔮 **Personal Analysis:**
Your question "${question}" resonates deeply with universal patterns. The cards suggest that you are at a significant crossroads where inner wisdom and outer action must align.

⚖️ **Wisdom Integration:**
${cardInsights.length > 1 ? 'The combination of these cards' : 'This card'} encourages you to trust the divine timing of your life. Take inspired action while remaining open to the subtle guidance of the universe.

🎭 **Poetic Sublimation:**
Like stars weaving stories across the infinite sky, your soul's journey unfolds with perfect timing. Each step, each breath, each choice is part of the magnificent tapestry of your becoming.

*Channeled with love through the Night God Tarot AI Oracle*
        `,
        ja: `
🌟 **ナイトゴッドタロットからの神聖な導き** 🌟

宇宙の力が整列し、神聖なカード：**${cards.map(c => c.name).join('、')}**を通してあなたに深い知恵をもたらしました。

✨ **集合的知恵：**
${cardInsights.join('。')}。これらの古代のシンボルは、変容、成長、そして運命と自由意志の永遠の舞について語っています。

🔮 **個人的分析：**
あなたの質問「${question}」は宇宙のパターンと深く共鳴しています。カードは、内なる知恵と外なる行動が一致しなければならない重要な分岐点にあることを示唆しています。

⚖️ **知恵の統合：**
${cardInsights.length > 1 ? 'これらのカードの組み合わせ' : 'このカード'}は、あなたの人生の神聖なタイミングを信じることを奨励しています。宇宙の微細な導きに心を開きながら、インスピレーションに基づいた行動を取ってください。

🎭 **詩的昇華：**
無限の空に物語を織る星のように、あなたの魂の旅は完璧なタイミングで展開されます。一歩一歩、一息一息、一つ一つの選択は、あなたの成長という壮大なタペストリーの一部なのです。

*ナイトゴッドタロットAI神託により愛を込めて伝達*
        `
      };

      return res.json({
        ...reading,
        interpretation: fallbackInterpretations[language] || fallbackInterpretations.zh,
        collectiveWisdom: language === 'zh' ? '宇宙通過永恆的轉化符號訴說' : 
                        language === 'ja' ? '宇宙は永遠の変容のシンボルを通して語りかけます' : 
                        'The universe speaks through eternal symbols of transformation',
        personalAnalysis: language === 'zh' ? '您的道路被內在智慧與宇宙時機所照亮' :
                         language === 'ja' ? 'あなたの道は内なる知恵と宇宙のタイミングによって照らされています' :
                         'Your path is illuminated by inner wisdom and cosmic timing',
        wisdomIntegration: language === 'zh' ? '相信您的直覺並採取靈感行動' :
                          language === 'ja' ? 'あなたの直感を信じ、インスピレーションに基づいた行動を取ってください' :
                          'Trust your intuition and take inspired action',
        poeticSublimation: language === 'zh' ? '您的旅程如星光般在宇宙虛空中展開' :
                          language === 'ja' ? 'あなたの旅は宇宙の虚空を横切る星の光のように展開されます' :
                          'Your journey unfolds like starlight across the cosmic void',
        fallback: true,
        unlimited: process.env.MONICA_UNLIMITED_MODE === 'true',
        apiError: aiResponse.status
      });
    }

    const aiData = await aiResponse.json();
    const interpretation = aiData.choices[0].message.content;

    res.json({
      ...reading,
      interpretation,
      model: 'claude-3-5-sonnet',
      language,
      unlimited: process.env.MONICA_UNLIMITED_MODE === 'true',
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

// Payment webhook endpoints
app.post('/api/webhooks/buymeacoffee', express.raw({ type: 'application/json' }), (req, res) => {
  // Handle Buy Me a Coffee webhook
  console.log('Buy Me a Coffee webhook received');
  res.status(200).send('OK');
});

app.post('/api/webhooks/ipass', express.raw({ type: 'application/json' }), (req, res) => {
  // Handle iPass Money webhook
  console.log('iPass Money webhook received');
  res.status(200).send('OK');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║     🌙 Night God Tarot API Server 🌙        ║
╠══════════════════════════════════════════════╣
║  Server running on port ${PORT}                 ║
║  Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  Monica AI: ${process.env.MONICA_API_KEY ? 'Connected' : 'Not configured'}                    ║
║  URL: http://localhost:${PORT}                  ║
╚══════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;