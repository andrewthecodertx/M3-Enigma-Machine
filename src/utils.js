export default class utils {
  /**
   * @param {number|string} input
   * @returns {string|number}
   */
  static convert(input) {
    if (typeof input === 'number') {
      if (input < 0 || input > 25) {
        throw new Error("Position must be between 0 and 25");
      }

      return String.fromCharCode(65 + input);
    }

    if (typeof input === 'string') {
      if (input.length !== 1) {
        throw new Error("Input must be a single character");
      }

      const position = input.toUpperCase().charCodeAt(0) - 65;

      if (position < 0 || position > 25) {
        throw new Error("Input must be a letter A-Z");
      }

      return position;
    }

    throw new Error("Input must be a number (0-25) or letter (A-Z)");
  }
}
