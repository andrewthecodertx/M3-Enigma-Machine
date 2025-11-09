import utils from '../utils.js';

export default class PlugBoard {
  /**
   * @param {string[]} connections
   * @returns {PlugBoard}
   */
  constructor(connections) {
    this.connections = connections || [];
    this.wiring = {};

    if (this.connections.length > 10) {
      throw new Error('The plug board can only handle up to 10 plug pairs.');
    }

    const lettersUsed = new Set();

    for (let pair of this.connections) {
      if (pair.length !== 2 || typeof pair !== 'string') {
        throw new Error('Each plug must be a string of exactly two letters.');
      }

      const [a, b] = pair.toUpperCase().split('');

      if (!this.isValidLetter(a) || !this.isValidLetter(b)) {
        throw new Error('Plugs must contain only letters A-Z.');
      }

      if (a === b) {
        throw new Error('Plugs cannot be connected to themselves.');
      }

      if (lettersUsed.has(a) || lettersUsed.has(b)) {
        throw new Error(`Duplicate connection for letter ${lettersUsed.has(a) ? a : b}.`);
      }

      lettersUsed.add(a);
      lettersUsed.add(b);

      this.wiring[a] = b;
      this.wiring[b] = a;
    }
  }

  /**
   * @param {string} char
   * @returns {boolean}
   */
  isValidLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  /**
   * @param {number} input
   * @returns {number}
   */
  process(input) {
    const inputChar = utils.convert(input); // Convert number to char
    const outputChar = this.wiring[inputChar] || inputChar;
    return utils.convert(outputChar); // Convert char to number
  }
}
