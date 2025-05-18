const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Chat endpoint with OpenRouter API
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request');
    
    const messages = req.body.messages || [];
    
    // Format messages for the API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
      content: msg.role === 'system' ? 
        `${msg.content}\n\nIMPORTANT: You are a compassionate mental health support assistant. Always be empathetic, non-judgmental, and provide helpful, actionable advice. Focus on emotional support and practical coping strategies.` : 
        msg.content
    }));
    
    console.log('Sending request to OpenRouter');
    
    // Call OpenRouter API - Uses Claude 3 Haiku (free tier)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3001', // Your site URL
        'X-Title': 'Mental Health Chatbot', // Your app name
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku', // Free tier model
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('OpenRouter API response received');
    
    // OpenRouter returns in OpenAI format
    res.json(result);
    
  } catch (error) {
    console.error('Server error:', error);
    
    // Fallback response
    res.json({
      choices: [
        {
          message: {
            content: "I'm here to support you through whatever you're experiencing. While I'm having some technical difficulties, please know that your feelings are valid and important. Would you like to share what's on your mind?"
          }
        }
      ]
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(cors({
  origin: 'https://eunoiaai-mental-health-bot.netlify.app',
  optionsSuccessStatus: 200
}));
