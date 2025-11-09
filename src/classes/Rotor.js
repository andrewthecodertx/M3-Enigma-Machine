import utils from '../utils.js';
import { rotorData } from '../dataLoader.js';

export default class Rotor {
  /**
   * @param {string} name
   * @param {string} ring
   * @param {string} position
   * @returns {Rotor}
   */
  constructor(name, ring, position) {
    const rotorConfig = rotorData.find(r => r.name === name);
    if (!rotorConfig) {
      throw new Error(`Rotor with name ${name} not found.`);
    }
    this.name = name;
    this.wiring = rotorConfig.wiring;
    this.notch = utils.convert(rotorConfig.notch);
    this.ring = typeof ring === 'number' ? ring % 26 : utils.convert(ring) % 26;
    this.initialPosition = typeof position === 'number' ? position % 26 : utils.convert(position) % 26;
    this.position = this.initialPosition;
  }

  reset() {
    this.position = this.initialPosition;
  }

  /**
   * @returns {void}
   */
  step() {
    this.position = (this.position + 1) % 26;
  }

  /**
   * @returns {boolean}
   */
  isAtNotch() {
    return this.position === this.notch;
  }

  /**
   * @param {string} input
   * @param {boolean} isReverse
   * @returns {string}
   */
  process(input, isReverse = false) {
    let i = input; // input - converted to position
    let p = this.position; // position of the rotor
    let r = this.ring; // ring setting of the rotor
    let w = this.wiring; // rotor wiring

    let output;

    if (!isReverse) {
      // Forward pass (Right to Left)
      // 1. Adjust input for rotor position and ring setting
      let adjustedInput = (i + p - r + 26) % 26;
      // 2. Map through the wiring
      let charThroughWiring = w[adjustedInput];
      let numThroughWiring = utils.convert(charThroughWiring);
      // 3. Adjust back for rotor position and ring setting
      output = (numThroughWiring - p + r + 26) % 26;
    } else {
      // Reverse pass (Left to Right)
      // 1. Adjust input for rotor position and ring setting
      let adjustedInput = (i + p - r + 26) % 26;
      // 2. Find the index in the wiring that maps to the character at adjustedInput's position in the standard alphabet.
      let charToFindInWiring = utils.convert(adjustedInput);
      let indexInWiring = w.indexOf(charToFindInWiring);
      // 3. Adjust back for rotor position and ring setting
      output = (indexInWiring - p + r + 26) % 26;
    }

    return output;
  }
}
