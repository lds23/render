import dotenv from "dotenv";
import { OpenAI } from "openai";

import express, { Request, Response, NextFunction } from 'express';

const sysPrompt = `### RULES
Rozwiąż to zadanie, stosując logikę krok po kroku. Podaj wynik dopiero po zakończeniu wszystkich kroków:
1. Zidentyfikuj problem.
2. Rozważ dostępne opcje.
3. Wybierz najlepsze rozwiązanie i podaj odpowiedź.

### SETUP
To gra. Jesteś operatorem drona i poruszasz się po mapie (opis w sekcji MAP). Przeanalizuj dokładnie otrzymaną instrukcję. Jeśli wydający instrukcje zmienił zdanie zignoruj poprzednie instrukcje. Po wykonaniu komend z instrukcji podaj co znajduje się na polu, na które doleciałeś.
- Instrukcja W PRAWO/W LEWO oznacza zmianę zmiennej x o 1. W PRAWO +1, w LEWO -1
- Instrukcja w W DÓŁ/W GÓRĘ oznacza zmianę zmiennej y. W DÓŁ +1, W GÓRĘ -1
- Instrukcje: MAKSYMALNIE, NA MAKSA, DO KOŃCA oznaczają zmianę na przesunięcie do granic mapy na 0 lub 3 

### MAP 
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

### EXAMPLES
Q: Idziemy na sam dół mapy.
A: { "description" : "dom budynek"}

Q: Idziemy na sam dół mapy. Albo nie! nie! nie idziemy. Zaczynamy od nowa. W prawo maksymalnie idziemy. Co my tam mamy?
A: { "description" : "góry skały"}

### RESULT
Wypisz swoj tok rozumowania.
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
  res.send('Up!');
});

app.post('/ai', async(req: Request, res: Response, next: NextFunction) => {

  const q = req.body;
  const question = q["instruction"];
  console.log('q: ' + question);

  const resp = await getAIresp(question, sysPrompt);
  console.log('a: ' + resp);
  const finalResp = getLast3Lines(resp);
  console.log('fa: ' + finalResp);

  res.send(finalResp);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, });

function getLast3Lines(text: string): string {
  const lines = text.split(/\r?\n/);
  return lines[lines.length - 3] + '\n' + lines[lines.length - 2] + '\n' + lines[lines.length - 1];
}

async function getAIresp(prompt: string, sysCommand: string): Promise<string> {
    const aiResp = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: sysCommand },
        { role: "user", content: prompt },]
    });
    const resp = aiResp.choices[0].message!.content!;
    return resp;
}