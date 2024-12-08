import dotenv from "dotenv";
import { OpenAI } from "openai";

import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Define a route with properly typed parameters
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello, TypeScript with Express!');
});

app.post('/ai', async(req: Request, res: Response, next: NextFunction) => {

  const question = req.body;
  console.log('q: ' + question["instruction"]);

  //const resp = await getAIresp('grzyby', 'opowiedz dowcip na podany temat');

  //res.send('ai : ' + resp);
  res.send('ai : ???');
});

/*
{
"instruction":"tutaj instrukcja gdzie poleciał dron"
}
*/

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, });

async function getAIresp(prompt: string, sysCommand: string): Promise<string> {
    const aiResp = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: sysCommand },
        { role: "user", content: prompt },]
    });
    const resp = aiResp.choices[0].message!.content!;
    return resp;
}