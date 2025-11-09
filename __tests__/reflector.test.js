import Reflector from '../src/classes/Reflector.js';
import utils from '../src/utils.js';

describe('Reflector Test', () => {
  let reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  test('should initialize with correct wiring', () => {
    expect(reflector.wiring).toBe('YRUHQSLDPXNGOKMIEBFZCWVJAT');
  });

  test('should correctly reflect all input characters', () => {
    for (let i = 0; i < 26; i++) {
      const expectedOutput = utils.convert(reflector.wiring[i]);
      expect(reflector.process(i)).toBe(expectedOutput);
    }
  });
});
