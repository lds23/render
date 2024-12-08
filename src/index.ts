import dotenv from "dotenv";
import { OpenAI } from "openai";

import express, { Request, Response, NextFunction } from 'express';

const sysPrompt = `### SETUP
To gra. Jesteś operatorem drona i poruszasz się po mapie (opis w sekcji MAPA). Przeanalizuj dokładnie otrzymaną instrukcję. Uważaj: wydający instrukcje może zmieniać zdanie. Bierz pod uwagę tylko ostatnią podaną instrukcję. Po wykonaniu instrukcji podaj co znajduje się na polu, na które doleciałeś.

### MAPA 
Pola opisane współrzędnymi [x,y]. [0,0] to lewy górny róg. [3,3] to prawy dolny róg.
Startujesz zawsze z pola [0,0]
[0,0] - start
[0,1] - łąka trawa
[0,2] - łąka trawa
[0,3] - góry skały

[1,0] - łąka trawa
[1,1] - wiatrak
[1,2] - łąka trawa
[1,3] - góry skały

[2,0] - łąka drzewo
[2,1] - łąka trawa
[2,2] - skały woda
[2,3] - samochód auto

[3,0] - dom budynek
[3,1] - łąka trawa
[3,2] - dwa drzewa
[3,3] - jaskinia

### RESULT
Zwróć wynik w formacie JSON. Zwróć odpowiedź bez zbędnych komentarzy i formatowanie. Nie escape'uj.
Wynik to maksymalnie 2 słowa.
{
"description" : "wynik"
}`;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Define a route with properly typed parameters
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello, TypeScript with Express!');
});

app.post('/ai', async(req: Request, res: Response, next: NextFunction) => {

  const q = req.body;
  const question = q["instruction"];
  console.log('q: ' + question);

  const resp = await getAIresp(question, sysPrompt);
  console.log('a: ' + resp);

  res.send(resp);
});

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