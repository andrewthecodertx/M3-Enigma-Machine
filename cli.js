import readline from 'readline';
import { readFile } from 'fs/promises';
import { EnigmaMachine } from './src/classes/EnigmaMachine.js';
import PlugBoard from './src/classes/PlugBoard.js';
import Rotor from './src/classes/Rotor.js';
import Reflector from './src/classes/Reflector.js';
// import { machineSettings } from './src/dataLoader.js';
import { saveSettings } from './src/settingsManager.js';

const DEFAULT_SAVE_FILE = './user_settings/enigma_settings.enigma';
const DEFAULT_LOAD_FILE = './data/machineSettings.enigma';

let enigmaMachine;

async function initEnigma(settings) {
  try {
    const plugboard = new PlugBoard(settings.plugboard);
    const leftRotor = new Rotor(settings.rotors[0].name, settings.rotors[0].ring, settings.rotors[0].position);
    const middleRotor = new Rotor(settings.rotors[1].name, settings.rotors[1].ring, settings.rotors[1].position);
    const rightRotor = new Rotor(settings.rotors[2].name, settings.rotors[2].ring, settings.rotors[2].position);
    const reflector = new Reflector();

    enigmaMachine = new EnigmaMachine({
      plugboard,
      leftRotor,
      middleRotor,
      rightRotor,
      reflector,
    });

    console.log('Enigma machine initialized with new settings.');
  } catch (error) {
    console.error(`Error initializing Enigma machine: ${error.message}`);
  }
}

async function loadSettingsFromFile(filename) {
  try {
    const data = await readFile(filename, 'utf8');
    const settings = JSON.parse(data);

    await initEnigma(settings);

    console.log(`Settings loaded from ${filename}`);
  } catch (error) {
    console.error(`Error loading settings from ${filename}: ${error.message}`);
  }
}

async function handleSaveCommand(args) {
  const filename = args[0] || DEFAULT_SAVE_FILE;
  if (!enigmaMachine) {
    console.log("Enigma machine not fully initialized. Cannot save settings.");
    return;
  }
  await saveSettings(
    enigmaMachine.plugboard,
    enigmaMachine.leftRotor,
    enigmaMachine.middleRotor,
    enigmaMachine.rightRotor,
    enigmaMachine.reflector,
    filename
  );
}

async function handleProcessCommand(args) {
  const inputMessage = args.join(' ');
  if (!inputMessage) {
    console.log("Please provide a message to process.");
    return;
  }
  if (!enigmaMachine) {
    console.log("Enigma machine not fully initialized. Cannot process message.");
    return;
  }
  enigmaMachine.reset();
  const output = enigmaMachine.processMessage(inputMessage);
  console.log(`Output: ${output}`);
}

function handleSettingsCommand() {
  if (!enigmaMachine) {
    console.log("Enigma machine not fully initialized. Cannot display settings.");
    return;
  }
  const settings = enigmaMachine.getSettings();
  console.log('Current Enigma Settings:');
  console.log(`  Plugboard: ${settings.plugboard.join(' ')}`);
  console.log('  Rotors:');
  settings.rotors.forEach(rotor => {
    console.log(`    - ${rotor.name}: Ring ${rotor.ring}, Position ${rotor.position}`);
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

async function startCli() {
  let initialSettingsFile = DEFAULT_LOAD_FILE;

  await new Promise(resolve => {
    rl.question(`Enter path to settings file (default: ${DEFAULT_LOAD_FILE}): `, async (answer) => {
      if (answer.trim() !== '') {
        initialSettingsFile = answer.trim();
      }
      resolve();
    });
  });

  await loadSettingsFromFile(initialSettingsFile);

  console.log('Welcome to the Enigma CLI!');
  console.log('Commands: load [filename], save [filename], process <message>, settings, exit');
  rl.prompt();

  rl.on('line', async (line) => {
    const [command, ...args] = line.trim().split(/\s+/);

    switch (command.toLowerCase()) {
      case 'load':
        await loadSettingsFromFile(args[0] || DEFAULT_LOAD_FILE);
        break;
      case 'save':
        await handleSaveCommand(args);
        break;
      case 'process':
        await handleProcessCommand(args);
        break;
      case 'settings':
        handleSettingsCommand();
        break;
      case 'exit':
      case 'quit':
      case 'q':
      case 'bye':
        rl.close();
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Exiting Enigma CLI. Goodbye!');
    process.exit(0);
  });
}

startCli();
