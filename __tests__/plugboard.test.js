import PlugBoard from '../src/classes/PlugBoard.js'
import utils from '../src/utils.js'

describe('PlugBoard Test', () => {
  let plugboard;

  beforeEach(() => {
    plugboard = new PlugBoard(['AB', 'CD']);
  });

  test('should switch connected letters', () => {
    expect(plugboard.process(utils.convert('A'))).toBe(utils.convert('B'));
    expect(plugboard.process(utils.convert('B'))).toBe(utils.convert('A'));
    expect(plugboard.process(utils.convert('C'))).toBe(utils.convert('D'));
    expect(plugboard.process(utils.convert('D'))).toBe(utils.convert('C'));
  });

  test('should return the same letter if not connected', () => {
    expect(plugboard.process(utils.convert('E'))).toBe(utils.convert('E'));
  });

  test('should handle empty connections', () => {
    const emptyPlugboard = new PlugBoard([]);
    expect(emptyPlugboard.process(utils.convert('A'))).toBe(utils.convert('A'));
    expect(emptyPlugboard.process(utils.convert('Z'))).toBe(utils.convert('Z'));
  });

  test('should throw error for duplicate connections', () => {
    expect(() => new PlugBoard(['AB', 'AC'])).toThrow('Duplicate connection for letter A.');
  });

  test('should throw error for single letter connections', () => {
    expect(() => new PlugBoard(['A'])).toThrow('Each plug must be a string of exactly two letters.');
  });

  test('should throw error if plug is connected to itself', () => {
    expect(() => new PlugBoard(['AA'])).toThrow('Plugs cannot be connected to themselves.');
  });
});
