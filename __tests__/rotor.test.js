import { jest } from '@jest/globals';
import Rotor from '../src/classes/Rotor.js'
import utils from '../src/utils.js'

// Mock the dataLoader module
jest.mock('../src/dataLoader.js');

describe('Rotor Test', () => {
  let rotor;

  beforeEach(() => {
    rotor = new Rotor('I', 'A', 'A')
  })

  test('should initialize with correct properties', () => {
    expect(rotor.name).toBe('I');
    expect(rotor.wiring).toBe('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
    expect(rotor.notch).toBe(16); // 'Q' is the 16th letter (0-indexed)
    expect(rotor.ring).toBe(0); // 'A' is the 0th letter (0-indexed)
    expect(rotor.position).toBe(0); // 'A' is the 0th letter (0-indexed)
  });

  describe('process', () => {
    test('should process a character in forward direction', () => {
      // Rotor I, wiring EKMFLGDQVZNTOWYHXUSPAIBRCJ
      // A (0) -> E (4)
      expect(rotor.process(utils.convert('A'))).toBe(utils.convert('E'));
      // B (1) -> K (10)
      expect(rotor.process(utils.convert('B'))).toBe(utils.convert('K'));
      // Z (25) -> J (9)
      expect(rotor.process(utils.convert('Z'))).toBe(utils.convert('J'));
    });

    test('should process a character in reverse direction', () => {
      // Rotor I, wiring EKMFLGDQVZNTOWYHXUSPAIBRCJ
      // E (4) -> A (0)
      expect(rotor.process(utils.convert('E'), true)).toBe(utils.convert('A'));
      // K (10) -> B (1)
      expect(rotor.process(utils.convert('K'), true)).toBe(utils.convert('B'));
      // J (9) -> Z (25)
      expect(rotor.process(utils.convert('J'), true)).toBe(utils.convert('Z'));
    });

    test('should account for rotor position in forward direction', () => {
      rotor.position = utils.convert('B'); // Set position to B (1)
      // A (0) + B (1) = 1. EKMFLGDQVZNTOWYHXUSPAIBRCJ[1] = K (10)
      // K (10) - B (1) = J (9)
      expect(rotor.process(utils.convert('A'))).toBe(utils.convert('J'));
    });

    test('should account for rotor position in reverse direction', () => {
      rotor.position = utils.convert('B'); // Set position to B (1)
      // J (9) + B (1) = K (10). EKMFLGDQVZNTOWYHXUSPAIBRCJ.indexOf(K) = 1
      // 1 - B (1) = A (0)
      expect(rotor.process(utils.convert('J'), true)).toBe(utils.convert('A'));
    });

    test('should account for ring setting in forward direction', () => {
      rotor = new Rotor('I', 'B', 'A'); // Ring setting to B (1)
      // A (0) - B (1) = -1. -1 + 26 = 25. EKMFLGDQVZNTOWYHXUSPAIBRCJ[25] = J (9)
      // J (9) + B (1) = K (10)
      expect(rotor.process(utils.convert('A'))).toBe(utils.convert('K'));
    });

    test('should account for ring setting in reverse direction', () => {
      rotor = new Rotor('I', 'B', 'A'); // Ring setting to B (1)
      // Input K (10), Position A (0), Ring B (1)
      // Adjusted input to wiring: (10 + 0 - 1 + 26) % 26 = 9 (J)
      // Index of 'J' in Rotor I wiring ('EKMFLGDQVZNTOWYHXUSPAIBRCJ') is 25.
      // Adjusted output from wiring: (25 - 0 + 1 + 26) % 26 = 0 (A)
      expect(rotor.process(utils.convert('K'), true)).toBe(utils.convert('A'));
    });
  });

  describe('step', () => {
    test('should increment the rotor position', () => {
      rotor.position = 0; // A
      rotor.step();
      expect(rotor.position).toBe(1); // B
    });

    test('should wrap around from Z to A', () => {
      rotor.position = 25; // Z
      rotor.step();
      expect(rotor.position).toBe(0); // A
    });
  });

  describe('isAtNotch', () => {
    test('should return true if rotor is at its notch position', () => {
      rotor.position = rotor.notch; // Set to notch position (Q for Rotor I)
      expect(rotor.isAtNotch()).toBe(true);
    });

    test('should return false if rotor is not at its notch position', () => {
      rotor.position = rotor.notch - 1; // Set to one before notch
      expect(rotor.isAtNotch()).toBe(false);
      rotor.position = rotor.notch + 1; // Set to one after notch
      expect(rotor.isAtNotch()).toBe(false);
    });
  });
});
