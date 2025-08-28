// chatbotRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Adjust configuration for your proxy
const PROXY_URL = 'https://your-proxy-url/chat/completions'; // Replace with actual proxy
const MODEL_NAME = 'gpt-4'; // Or as needed

router.post('/message', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Prepare the payload
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
    // Proxy request to AI model
    const response = await axios.post(PROXY_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // matches frontend timeout
    });

    // Extract bot response
    let botReply = response.data.choices?.[0]?.message?.content 
      || response.data.response
      || 'Sorry, I could not generate a response.';

    res.json({ response: botReply });
  } catch (error) {
    res.status(502).json({ error: 'Proxy error', details: error.message });
  }
});

module.exports = router;
