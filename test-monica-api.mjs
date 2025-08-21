import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const MONICA_API_KEY = process.env.MONICA_API_KEY;

async function testMonicaAPI() {
    console.log('🔍 Testing Monica AI API connection...\n');
    
    if (!MONICA_API_KEY) {
        console.error('❌ MONICA_API_KEY not found in environment variables');
        return;
    }
    
    console.log('✅ API Key found:', MONICA_API_KEY.substring(0, 10) + '...');
    
    try {
        const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MONICA_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                messages: [
                    {
                        role: 'user',
                        content: 'Say "Night God Tarot API is working!" if you receive this message.'
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Monica AI Response:', data.choices?.[0]?.message?.content || 'No content');
            console.log('\n🎉 Monica AI API is working correctly!');
        } else {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
        }
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
}

testMonicaAPI();