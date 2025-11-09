import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { EnigmaMachine } from './src/classes/EnigmaMachine.js';
import PlugBoard from './src/classes/PlugBoard.js';
import Rotor from './src/classes/Rotor.js';
import Reflector from './src/classes/Reflector.js';
import utils from './src/utils.js';
import { rotorData } from './src/dataLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve data files
app.use('/data', express.static(path.join(__dirname, 'data')));
app.post('/process', (req, res) => {
  const { settings, message } = req.body;

  if (!settings || !message) {
    return res.status(400).json({ error: 'Missing settings or message in request body.' });
  }

  try {
    if (!settings.rotors || settings.rotors.length !== 3 || !settings.plugboard || !settings.reflector) {
      return res.status(400).json({ error: 'Invalid Enigma settings structure.' });
    }

    const plugboard = new PlugBoard(settings.plugboard);
    const leftRotor = new Rotor(settings.rotors[0].name, settings.rotors[0].ring, settings.rotors[0].position);
    const middleRotor = new Rotor(settings.rotors[1].name, settings.rotors[1].ring, settings.rotors[1].position);
    const rightRotor = new Rotor(settings.rotors[2].name, settings.rotors[2].ring, settings.rotors[2].position);
    const reflector = new Reflector();

    const enigma = new EnigmaMachine({
      plugboard,
      leftRotor,
      middleRotor,
      rightRotor,
      reflector,
    });

    const processedResult = enigma.processMessage(message);

    res.json({ result: processedResult });
  } catch (error) {
    console.error('Error processing Enigma message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Enigma API listening at http://localhost:${port}`);
  console.log(`Web interface available at http://localhost:${port}`);
  console.log(`API endpoint: POST http://localhost:${port}/process`);
});
