const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Suggestions endpoint
app.post('/api/suggestions', async (req, res) => {
  try {
    const prompt = `Create accessibility recommendations based on:
    - Usage Stats: ${JSON.stringify(req.body.usageStats)}
    - Current Modes: ${JSON.stringify(req.body.currentModes)}
    Return 3 bullet points with specific setting suggestions.`;
    
    const response = await axios.post(GEMINI_URL, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DEROGATORY",
          threshold: "BLOCK_NONE"
        }
      ]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    res.json({ suggestions: text });
  } catch (error) {
    console.error('Suggestion error:', error.response?.data || error.message);
    res.status(500).json({ 
      suggestions: "1. Try enabling Dyslexia Mode\n2. Adjust font sizes\n3. Enable focus highlights" 
    });
  }
});

app.listen(3000, () => console.log('Proxy server running on port 3000'));