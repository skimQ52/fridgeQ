const OpenAI = require('openai');
require('dotenv').config()

const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
});

module.exports = openai;