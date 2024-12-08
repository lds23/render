"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
const express_1 = __importDefault(require("express"));
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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
// Define a route with properly typed parameters
app.get('/', (req, res, next) => {
    res.send('Up!');
});
app.post('/ai', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.body;
    const question = q["instruction"];
    console.log('q: ' + question);
    const resp = yield getAIresp(question, sysPrompt);
    console.log('a: ' + resp);
    res.send(resp);
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
dotenv_1.default.config();
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY, });
function getAIresp(prompt, sysCommand) {
    return __awaiter(this, void 0, void 0, function* () {
        const aiResp = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: sysCommand },
                { role: "user", content: prompt },]
        });
        const resp = aiResp.choices[0].message.content;
        return resp;
    });
}
