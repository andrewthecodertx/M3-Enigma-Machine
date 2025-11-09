import { jest } from '@jest/globals';
import { EnigmaMachine } from '../src/classes/EnigmaMachine.js';
import PlugBoard from '../src/classes/PlugBoard.js';
import Rotor from '../src/classes/Rotor.js';
import Reflector from '../src/classes/Reflector.js';

// Mock dependencies
jest.mock('../src/classes/PlugBoard.js');
jest.mock('../src/classes/Rotor.js');
jest.mock('../src/classes/Reflector.js');

describe('EnigmaMachine', () => {
  let mockPlugBoard;
  let mockLeftRotor;
  let mockMiddleRotor;
  let mockRightRotor;
  let mockReflector;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPlugBoard = {
      process: jest.fn(char => char),
      connections: [],
    };
    mockLeftRotor = {
      process: jest.fn(char => char),
      isAtNotch: jest.fn(() => false),
      step: jest.fn(() => {}),
      name: 'mockLeftRotor',
      ring: 0,
      position: 0,
    };
    mockMiddleRotor = {
      process: jest.fn(char => char),
      isAtNotch: jest.fn(() => false),
      step: jest.fn(() => {}),
      name: 'mockMiddleRotor',
      ring: 0,
      position: 0,
    };
    mockRightRotor = {
      process: jest.fn(char => char),
      isAtNotch: jest.fn(() => false),
      step: jest.fn(() => {}),
      name: 'mockRightRotor',
      ring: 0,
      position: 0,
    };
    mockReflector = {
      process: jest.fn(char => char),
    };
  });

  test('should initialize with provided components', () => {
    const settings = {
      plugboard: mockPlugBoard,
      leftRotor: mockLeftRotor,
      middleRotor: mockMiddleRotor,
      rightRotor: mockRightRotor,
      reflector: mockReflector,
    };
    const enigma = new EnigmaMachine(settings);

    expect(enigma.plugboard).toBe(mockPlugBoard);
    expect(enigma.leftRotor).toBe(mockLeftRotor);
    expect(enigma.middleRotor).toBe(mockMiddleRotor);
    expect(enigma.rightRotor).toBe(mockRightRotor);
    expect(enigma.reflector).toBe(mockReflector);
  });

  describe('processChar', () => {
    let enigma;

    beforeEach(() => {
      // Reset mock call counts before each test in this describe block
      jest.clearAllMocks();

      // Re-initialize mocks for each test to ensure isolation
      mockPlugBoard = {
        process: jest.fn(char => char),
        connections: [],
      };
      mockLeftRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockLeftRotor',
        ring: 0,
        position: 0,
      };
      mockMiddleRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockMiddleRotor',
        ring: 0,
        position: 0,
      };
      mockRightRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockRightRotor',
        ring: 0,
        position: 0,
      };
      mockReflector = {
        process: jest.fn(char => char),
      };

      const settings = {
        plugboard: mockPlugBoard,
        leftRotor: mockLeftRotor,
        middleRotor: mockMiddleRotor,
        rightRotor: mockRightRotor,
        reflector: mockReflector,
      };
      enigma = new EnigmaMachine(settings);
    });

    test('should process a single character through the machine', () => {
      // Input 'A' (0)
      // Define the mock processing sequence using numerical values (0-25)
      mockPlugBoard.process.mockImplementationOnce(input => input + 1); // 0 (A) -> 1 (B)
      mockRightRotor.process.mockImplementationOnce(input => input + 2); // 1 (B) -> 3 (D)
      mockMiddleRotor.process.mockImplementationOnce(input => input + 3); // 3 (D) -> 6 (G)
      mockLeftRotor.process.mockImplementationOnce(input => input + 4); // 6 (G) -> 10 (K)
      mockReflector.process.mockImplementationOnce(input => input + 5); // 10 (K) -> 15 (P)
      mockLeftRotor.process.mockImplementationOnce(input => input - 4); // 15 (P) -> 11 (L)
      mockMiddleRotor.process.mockImplementationOnce(input => input - 3); // 11 (L) -> 8 (I)
      mockRightRotor.process.mockImplementationOnce(input => input - 2); // 8 (I) -> 6 (G)
      mockPlugBoard.process.mockImplementationOnce(input => input - 1); // 6 (G) -> 5 (F)

      const inputChar = 'A';
      const expectedOutputChar = 'F';

      const result = enigma.processChar(inputChar);

      // Verify the sequence of calls and the final output
      expect(mockPlugBoard.process).toHaveBeenCalledTimes(2);
      expect(mockRightRotor.process).toHaveBeenCalledTimes(2);
      expect(mockMiddleRotor.process).toHaveBeenCalledTimes(2);
      expect(mockLeftRotor.process).toHaveBeenCalledTimes(2);
      expect(mockReflector.process).toHaveBeenCalledTimes(1);

      expect(result).toBe(expectedOutputChar);
    });
  });

  describe('advanceRotors', () => {
    let enigma;

    beforeEach(() => {
      jest.clearAllMocks();

      mockPlugBoard = {
        process: jest.fn(char => char),
        connections: [],
      };
      mockLeftRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockLeftRotor',
        ring: 0,
        position: 0,
      };
      mockMiddleRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockMiddleRotor',
        ring: 0,
        position: 0,
      };
      mockRightRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockRightRotor',
        ring: 0,
        position: 0,
      };
      mockReflector = {
        process: jest.fn(char => char),
      };

      const settings = {
        plugboard: mockPlugBoard,
        leftRotor: mockLeftRotor,
        middleRotor: mockMiddleRotor,
        rightRotor: mockRightRotor,
        reflector: mockReflector,
      };
      enigma = new EnigmaMachine(settings);
    });

    test('should step only the right rotor if no notch is reached', () => {
      mockRightRotor.isAtNotch.mockReturnValue(false);
      mockMiddleRotor.isAtNotch.mockReturnValue(false);

      enigma.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).not.toHaveBeenCalled();
      expect(mockLeftRotor.step).not.toHaveBeenCalled();
    });

    test('should step middle and right rotors if right rotor is at notch', () => {
      mockRightRotor.isAtNotch.mockReturnValue(true);
      mockMiddleRotor.isAtNotch.mockReturnValue(false);

      enigma.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).toHaveBeenCalledTimes(1);
      expect(mockLeftRotor.step).not.toHaveBeenCalled();
    });

    test('should step all three rotors (double-stepping) if middle rotor is at notch and right rotor is at notch', () => {
      mockRightRotor.isAtNotch.mockReturnValue(true);
      mockMiddleRotor.isAtNotch.mockReturnValue(true);

      enigma.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).toHaveBeenCalledTimes(1);
      expect(mockLeftRotor.step).toHaveBeenCalledTimes(1);
    });
  });

  describe('processMessage', () => {
    let enigma;

    beforeEach(() => {
      jest.clearAllMocks();

      mockPlugBoard = {
        process: jest.fn(char => char),
        connections: [],
      };
      mockLeftRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockLeftRotor',
        ring: 0,
        position: 0,
      };
      mockMiddleRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockMiddleRotor',
        ring: 0,
        position: 0,
      };
      mockRightRotor = {
        process: jest.fn(char => char),
        isAtNotch: jest.fn(() => false),
        step: jest.fn(() => {}),
        name: 'mockRightRotor',
        ring: 0,
        position: 0,
      };
      mockReflector = {
        process: jest.fn(char => char),
      };

      const settings = {
        plugboard: mockPlugBoard,
        leftRotor: mockLeftRotor,
        middleRotor: mockMiddleRotor,
        rightRotor: mockRightRotor,
        reflector: mockReflector,
      };
      enigma = new EnigmaMachine(settings);

      // Mock processChar to simplify testing processMessage
      jest.spyOn(enigma, 'processChar').mockImplementation(char => {
        // Simulate some transformation for testing
        if (char === 'A') return 'B';
        if (char === 'B') return 'C';
        return char; // Default for other characters
      });
    });

    test('should process each character in the message', () => {
      const message = 'AB';
      enigma.processMessage(message);

      expect(enigma.processChar).toHaveBeenCalledTimes(message.length);
      expect(enigma.processChar).toHaveBeenCalledWith('A');
      expect(enigma.processChar).toHaveBeenCalledWith('B');
    });

    test('should advance rotors for each character processed', () => {
      const message = 'ABC';
      jest.spyOn(enigma, 'advanceRotors');

      enigma.processMessage(message);

      expect(enigma.advanceRotors).toHaveBeenCalledTimes(message.length);
    });

    test('should return the correctly processed message', () => {
      const message = 'AB';
      const result = enigma.processMessage(message);
      expect(result).toBe('BC');
    });

    test('should ignore non-alphabetic characters', () => {
      const message = 'A1B2';
      const result = enigma.processMessage(message);
      expect(enigma.processChar).toHaveBeenCalledTimes(2);
      expect(enigma.processChar).toHaveBeenCalledWith('A');
      expect(enigma.processChar).toHaveBeenCalledWith('B');
      expect(result).toBe('BC');
    });
  });

  describe('error handling', () => {
    test('should throw an error if a required component is missing', () => {
      const invalidSettings = {
        plugboard: mockPlugBoard,
        leftRotor: mockLeftRotor,
        middleRotor: mockMiddleRotor,
        // rightRotor is missing
        reflector: mockReflector,
      };
      expect(() => new EnigmaMachine(invalidSettings)).toThrow();
    });
  });
});