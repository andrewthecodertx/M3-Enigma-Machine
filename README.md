# Enigma Machine Emulator

A JavaScript implementation of the World War II era Enigma Machine encryption
device. This emulator accurately recreates the functionality of the Enigma M3,
including the plugboard, three rotors, and the reflector.

## Features

- Implements the historical Enigma M3 machine components:
  - Five available rotors (I, II, III, IV, V) with their authentic wiring
  - UKW-B reflector with historical wiring
  - Plugboard supporting up to 10 plug pairs
  - Accurate stepping mechanism with rotor notches
- Supports encryption and decryption of text
- Handles spaces in input text (though the original machine had no space bar)

## Installation

```bash
npm install
```

## Running the Emulator

### Web Interface (Recommended)

The easiest way to use the Enigma machine is through the web interface:

**Live Demo:** https://developersandbox.xyz/enigma/

Or run locally:

```bash
node server.js
```

Then open your browser to `http://localhost:4000`

The web interface provides:
- Visual Enigma machine with authentic appearance
- Interactive keyboard and lampboard
- Real-time rotor position display
- Plugboard configuration
- Click keys or use your physical keyboard to encrypt/decrypt

### Command-Line Interface

Run the CLI emulator using Node.js:

```bash
node cli.js
```

This will start an interactive command-line interface. The following commands
are available:

- `process <message>`: Encrypts the given message.
- `settings`: Displays the current machine settings (rotors, plugboard, etc.).
- `load [filename]`: Loads machine settings from a file. Defaults to
`./data/machineSettings.enigma`.
- `save [filename]`: Saves the current machine settings to a file. Defaults
to `user_settings/enigma_settings.enigma`.
- `exit`, `quit`, `bye`: Exits the application.

## Components

For a detailed explanation of how the Enigma machine works and the
mathematical equations behind its operation, please refer to the
[Enigma Explanation Document](ENIGMA_EXPLANATION.md).

### PlugBoard

- Implements the plugboard (Steckerbrett) that allows letter pairs to be swapped
- Supports up to 10 plug pairs
- Validates input to ensure only valid letter pairs are used

### Rotor

- Implements the mechanical rotors with their unique wiring configurations
- Handles rotor stepping and notch positions
- Supports ring settings and initial positions
- Processes signals in both forward and reverse directions

### Reflector

- Implements the UKW-B reflector with historical wiring
- Reflects the signal back through the rotor system

## API Usage

The server also provides a REST API for programmatic access to the Enigma machine.

#### `POST /process`

Processes a message using the Enigma machine with the provided settings.

- **Method:** `POST`
- **URL:** `/process`
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "settings": {
    "plugboard": ["AZ", "BY"],
    "rotors": [
      { "name": "I", "ring": 0, "position": 0 },
      { "name": "II", "ring": 0, "position": 0 },
      { "name": "III", "ring": 0, "position": 0 }
    ],
    "reflector": "UKW-B"
  },
  "message": "HELLOWORLD"
}
```

- **Response:**

```json
{
  "result": "ENCRYPTEDMESSAGE"
}
```

- **Example (using curl):**

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"settings":{"plugboard":["AZ","BY"],"rotors":[{"name":"I","ring":0,"position":0},{"name":"II","ring":0,"position":0},{"name":"III","ring":0,"position":0}],"reflector":"UKW-B"},"message":"HELLOWORLD"}' \
http://localhost:4000/process
```

## Testing

The project includes comprehensive tests using Jest. Run the tests with:

```bash
npm test
```


## Historical Note

The Enigma Machine was a cipher device used by Nazi Germany during World War II.
This implementation is based on the Enigma M3, which was widely used by the
German military services and was one of the most common variants.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
