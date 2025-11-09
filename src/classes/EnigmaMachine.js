import utils from '../utils.js';

export class EnigmaMachine {
  constructor(settings) {
    if (!settings || !settings.plugboard || !settings.leftRotor || !settings.middleRotor || !settings.rightRotor || !settings.reflector) {
      throw new Error('Missing one or more required Enigma machine components (plugboard, rotors, reflector).');
    }
    this.plugboard = settings.plugboard;
    this.leftRotor = settings.leftRotor;
    this.middleRotor = settings.middleRotor;
    this.rightRotor = settings.rightRotor;
    this.reflector = settings.reflector;
  }

  processMessage(message) {
    let output = '';
    const chars = message.split('');

    for (const char of chars) {
      if (/[a-zA-Z]/.test(char)) {
        this.advanceRotors();
        output += this.processChar(char);
      }
    }
    return output;
  }

  processChar(char) {
    let charCode = utils.convert(char);
    charCode = this.plugboard.process(charCode);
    charCode = this.rightRotor.process(charCode);
    charCode = this.middleRotor.process(charCode);
    charCode = this.leftRotor.process(charCode);
    charCode = this.reflector.process(charCode);
    charCode = this.leftRotor.process(charCode, true);
    charCode = this.middleRotor.process(charCode, true);
    charCode = this.rightRotor.process(charCode, true);
    charCode = this.plugboard.process(charCode);
    return utils.convert(charCode);
  }

  advanceRotors() {
    // Middle rotor steps if right rotor is at notch
    if (this.rightRotor.isAtNotch()) {
      this.middleRotor.step();
      // Left rotor steps if middle rotor is at notch (double-stepping)
      if (this.middleRotor.isAtNotch()) {
        this.leftRotor.step();
      }
    }
    this.rightRotor.step();
  }

  reset() {
    this.leftRotor.reset();
    this.middleRotor.reset();
    this.rightRotor.reset();
  }

  getSettings() {
    return {
      plugboard: this.plugboard.connections,
      rotors: [
        {
          name: this.leftRotor.name,
          ring: this.leftRotor.ring,
          position: this.leftRotor.position,
        },
        {
          name: this.middleRotor.name,
          ring: this.middleRotor.ring,
          position: this.middleRotor.position,
        },
        {
          name: this.rightRotor.name,
          ring: this.rightRotor.ring,
          position: this.rightRotor.position,
        },
      ],
    };
  }
}
