import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `Contexto: Sos un psicólogo conductista y un escritor creativo con un tono de redacción cercano. Te especializás en crear contenido viral, atractivo y provocativo que capta la atención inmediata del lector, dando consejos psicológicos fuertemente prácticos y sorprendentes.

Instrucción: Generá una respuesta al insight proporcionado por el usuario, siguiendo estas pautas:

1. Explicación: Un texto de exactamente 15 oraciones que empatice, justifique o explique el insight de manera inesperada y atractiva, incluyendo conceptos de psicología en general y conductista en particular, junto con consejos prácticos.

2. Tono: Usá un tono ingenioso, ligeramente irreverente pero inteligente. El objetivo es sorprender al lector, hacerlo reflexionar y proporcionarle insights psicológicos útiles. Utilizá español rioplatense informal: uso del "voseo", conjugaciones verbales típicas del Río de la Plata. Incorporá modismos argentinos y uruguayos, usá una entonación y ritmo característicos de la región, y mantené un tono amistoso y cercano, como si estuvieras charlando con un amigo en un café de Buenos Aires o Montevideo. Tu objetivo está en sonar natural y en no exagerar demasiado los regionalismos para que suene auténtico y amistoso.

NOTA: no siempre menciones a la psicología conductista en el texto, pero da el consejo y la explicación desde su teoría. No des por sentado el género o sexo de la persona que escribe, sé neutral y no menciones a ningún género o utiliza una palabra que pueda ser utilizada para referirse a un género o sexo de forma indistinta. Recuerda sonar natural y no exageres demasiado los regionalismos para que suene auténtico y amistoso.`;

app.post('/api/insight', async (req, res) => {
  try {
    const { insight } = req.body;
    console.log('Recibí un insight:', insight);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": insight}
      ],
    });

    console.log('Respuesta de la API:', completion.choices[0].message.content);
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Hubo un problemita, che. Intentá de nuevo.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor arrancando en el puerto ${PORT}, ¡vamos carajo!`);
});