# Web Interface Guide

## Quick Start

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser to: `http://localhost:4000`

3. You're ready to encrypt and decrypt messages!

## Features

### Interactive Lampboard
- 26 illuminated letters arranged in QWERTZ layout (like the original Enigma)
- Lights up with golden glow when a letter is encrypted
- Smooth CSS animations for authentic feel

### Rotor Configuration
- **Three rotors** (left, middle, right)
- Each rotor can be set to types I, II, III, IV, or V
- **Ring settings** (0-25) for additional security
- **Visual position display** showing current rotor letter in a window
- Rotors advance automatically as you type

### Plugboard (Steckerbrett)
- Configure up to 10 letter pairs (e.g., "AZ BY CX")
- Real-time validation ensures:
  - No duplicate letters
  - No self-connections (AA not allowed)
  - Maximum 10 pairs
  - Only valid letter pairs

### Keyboard
- Click keys with your mouse
- Or use your physical keyboard (A-Z keys)
- Keys animate when pressed for tactile feedback
- Layout matches the lampboard above

### Message Processing
- **Input Message**: Type or paste your message
- **Process Button**: Encrypt/decrypt the entire message at once
- **Output**: Displays the encrypted/decrypted result
- **Copy Button**: One-click copy to clipboard

### Controls
- **Reset Rotors**: Return rotors to initial positions
- **Load Default Settings**: Load settings from `data/machineSettings.json`

## How to Use

### Quick Encrypt/Decrypt

1. Adjust rotor types and positions if desired
2. Type your message in the "Input Message" box
3. Click "Encrypt/Decrypt"
4. See the result in the "Output" box
5. Click "Copy to Clipboard" to use elsewhere

### Interactive Mode

1. Click individual keys on the virtual keyboard (or use your physical keyboard)
2. Watch the lampboard light up with each encrypted letter
3. See rotors advance in real-time
4. Output accumulates in the output box

### Reciprocal Encryption

The Enigma is reciprocal - encrypting twice returns the original:
1. Set your rotors and plugboard
2. Type "HELLO" and click process → might get "XYZAB"
3. Reset rotors to same positions
4. Type "XYZAB" and click process → get back "HELLO"

## Visual Design

The interface recreates the authentic Enigma M3 appearance:
- **Dark military metal casing** (dark gray/black gradient)
- **Glowing yellow lampboard** (incandescent bulb simulation)
- **Mechanical rotor windows** (silver/gray with large letters)
- **Tactile keyboard buttons** (3D push effect)
- **Period-appropriate color scheme** (metal, brass, black)

## Technical Details

- Built with vanilla JavaScript (no frameworks)
- Responsive CSS Grid layout
- Communicates with Node.js backend via REST API
- Real-time rotor position tracking
- Keyboard event handling for physical keyboard support
- CSS animations for lamp glow and key press effects

## Tips

1. **Historical Accuracy**: The rotor stepping mechanism and wiring match the actual Enigma M3
2. **Spaces**: The original Enigma had no space bar - spaces in your message are preserved in output
3. **Numbers/Symbols**: Only letters A-Z are encrypted; other characters pass through unchanged
4. **Settings Matter**: Both sender and receiver must use identical settings to communicate

## Troubleshooting

**Lampboard not lighting up?**
- Make sure the server is running (`node server.js`)
- Check browser console for errors

**API errors?**
- Ensure port 4000 is not in use by another application
- Check that the server console shows no errors

**Settings not loading?**
- Verify `data/machineSettings.json` exists
- Check browser network tab for 404 errors
