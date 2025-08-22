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
    const { cards, question, userId, preferences, useAdvanced = true } = req.body;
    
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
      // Use advanced multi-AI orchestration for unlimited users
      const orchestrationPrompt = `
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
      `;

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
                content: 'You are the Night God Tarot Master - a legendary oracle combining mystical wisdom with poetic eloquence. Your readings transform lives through beautiful, profound guidance.'
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
                content: 'You are a master tarot interpreter with deep knowledge of symbolism, psychology, and spiritual guidance.'
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
      
      // Enhanced fallback with card-specific insights
      const cardInsights = cards.map(card => {
        const insights = {
          'The Fool': 'New beginnings await you with infinite potential',
          'The Magician': 'You have all the tools needed to manifest your desires',
          'The High Priestess': 'Trust your intuition and inner wisdom',
          'The Empress': 'Abundance and creativity flow through your life',
          'The Emperor': 'Structure and leadership guide your path'
        };
        return insights[card.name] || 'This sacred card brings divine guidance to your journey';
      });

      return res.json({
        ...reading,
        interpretation: `
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
        collectiveWisdom: 'The universe speaks through eternal symbols of transformation',
        personalAnalysis: 'Your path is illuminated by inner wisdom and cosmic timing',
        wisdomIntegration: 'Trust your intuition and take inspired action',
        poeticSublimation: 'Your journey unfolds like starlight across the cosmic void',
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