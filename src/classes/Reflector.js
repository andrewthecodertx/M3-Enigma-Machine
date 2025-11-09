import utils from '../utils.js';

// historical UKW-B reflector
// this was the most common reflector used in the enigma machines
export default class Reflector {
  /**
   * @returns {Reflector}
   */
  constructor() {
    this.wiring = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
  }

  /**
   * @param {string} input
   * @returns {number}
   */
  process(input) {
    let outputChar = this.wiring[input];
    return utils.convert(outputChar);
  }
}
