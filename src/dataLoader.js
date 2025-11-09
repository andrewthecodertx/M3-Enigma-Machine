import { readFile } from 'fs/promises';
import path from 'path';

const loadRotorData = async () => {
  try {
    const data = await readFile(path.join(process.cwd(), 'data/rotors.json'));
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load rotor data:', error);
    return [];
  }
};

const loadMachineSettings = async () => {
  try {
    const data = await readFile(path.join(process.cwd(), 'data/machineSettings.enigma'));
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load machine settings:', error);
    return null;
  }
};

export const rotorData = await loadRotorData();
export const machineSettings = await loadMachineSettings();