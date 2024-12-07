import { OpenAI } from "openai";

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, Render!');
});

app.get('/ai', (req, res) => {
  res.send('AI Req');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, });

async function getAIresp(prompt: string, sysCommand: string): Promise<string> {
    const aiResp = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: sysCommand },
        { role: "user", content: prompt },]
    });
    const resp = aiResp.choices[0].message?.content;
    return resp;
}