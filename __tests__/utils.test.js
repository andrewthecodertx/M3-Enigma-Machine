import utils from '../src/utils.js';

describe('Utils Test', () => {
  describe('convert', () => {
    test('should convert number to letter', () => {
      expect(utils.convert(0)).toBe('A');
      expect(utils.convert(25)).toBe('Z');
      expect(utils.convert(13)).toBe('N');
    });

    test('should convert letter to number', () => {
      expect(utils.convert('A')).toBe(0);
      expect(utils.convert('Z')).toBe(25);
      expect(utils.convert('N')).toBe(13);
      expect(utils.convert('a')).toBe(0); // Test case insensitivity
    });

    test('should throw error for number out of range (less than 0)', () => {
      expect(() => utils.convert(-1)).toThrow('Position must be between 0 and 25');
    });

    test('should throw error for number out of range (greater than 25)', () => {
      expect(() => utils.convert(26)).toThrow('Position must be between 0 and 25');
    });

    test('should throw error for string not a single character', () => {
      expect(() => utils.convert('AB')).toThrow('Input must be a single character');
      expect(() => utils.convert('')).toThrow('Input must be a single character');
    });

    test('should throw error for string not a letter', () => {
      expect(() => utils.convert('1')).toThrow('Input must be a letter A-Z');
      expect(() => utils.convert('$')).toThrow('Input must be a letter A-Z');
    });

    test('should throw error for invalid input type', () => {
      expect(() => utils.convert(null)).toThrow('Input must be a number (0-25) or letter (A-Z)');
      expect(() => utils.convert(undefined)).toThrow('Input must be a number (0-25) or letter (A-Z)');
      expect(() => utils.convert([])).toThrow('Input must be a number (0-25) or letter (A-Z)');
      expect(() => utils.convert({})).toThrow('Input must be a number (0-25) or letter (A-Z)');
    });
  });
});
