// chatbotRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Move sensitive data to environment variables
const PROXY_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'tngtech/deepseek-r1t2-chimera:free';
const API_KEY = process.env.OPENROUTER_API_KEY; // Store in .env file

router.post('/message', async (req, res) => {
  const { message, sessionId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const payload = {
    model: MODEL_NAME,
    messages: [
      { role: 'user', content: message }
    ],
    user: sessionId,
    temperature: 0.7,
    max_tokens: 500
  };

  try {
    const response = await axios.post(PROXY_URL, payload, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` // Fixed: proper template literal with quotes
      },
      timeout: 30000 // Fixed: reasonable 30-second timeout
    });

    let botReply = response.data.choices?.[0]?.message?.content 
      || response.data.response
      || 'Sorry, I could not generate a response.';

    res.json({ response: botReply });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(502).json({ 
      error: 'Proxy error', 
      details: error.response?.data?.error || error.message 
    });
  }
});

module.exports = router;
