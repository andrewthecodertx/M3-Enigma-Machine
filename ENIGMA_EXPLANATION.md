# Enigma Machine Explanation

The Enigma Machine is a complex electromechanical device used for
encrypting and decrypting secret messages. This project implements a
simplified version of the Enigma machine, focusing on its core components
and their interactions.

## Components of the Enigma Machine

The Enigma machine, as implemented in this project, consists of the
following key components:

### 1. Plugboard (Steckerbrett)

* **Purpose:** The plugboard is the first and last stage of the
encryption process. It allows for the swapping of letter pairs before
and after the main rotor encryption. This adds a significant layer of
complexity to the encryption.
* **Configuration:** It is configured with a set of connections, where
each connection is a pair of letters (e.g., "AZ", "BY"). When a
signal passes through the plugboard, if it's one of the connected
letters, it gets swapped with its paired letter.
* **Limitations:** The implementation enforces certain rules:
  * A maximum of 10 plug pairs can be set.
  * Each plug must be a string of exactly two letters.
  * Plugs must contain only letters A-Z.
  * A letter cannot be connected to itself (e.g., "AA" is invalid).
  * A letter cannot be part of more than one connection (e.g., if
        "AZ" is connected, "AB" is invalid as 'A' is already used).
* **Example Configuration (from `machineSettings.json`):

    ```json
    "plugboard": [
      "AZ",
      "BY",
      "CX",
      "TD",
      "SW"
    ]
    ```

### 2. Rotors (Walzen)

* **Purpose:** Rotors are the core of the Enigma's encryption mechanism.
Each rotor is a disc with 26 electrical contacts on each side,
representing the letters of the alphabet. Inside, wires connect these
contacts in a complex, scrambled pattern. As a signal passes through
a rotor, it undergoes a substitution based on the rotor's internal
wiring and its current rotational position.
* **Configuration:** Each rotor has:
  * **Name:** Identifies the specific rotor type (e.g., "I", "II",
    "III", "IV", "V").
  * **Wiring:** A fixed permutation of the alphabet that defines how
    electrical signals are routed through the rotor.
  * **Notch:** A specific position on the rotor that, when reached,
    causes the adjacent rotor to advance.
  * **Ring Setting (Ringstellung):** An offset that changes the
    alignment of the alphabet ring relative to the internal wiring.
    This effectively shifts the substitution pattern.
  * **Position (Grundstellung):** The current rotational position of
    the rotor. This changes as the machine operates.
* **Stepping Mechanism:** Rotors advance (step) during encryption. The
  rightmost rotor steps with every character processed. The middle rotor
  steps when the right rotor reaches its "notch" position. The leftmost
  rotor steps when the middle rotor reaches its "notch" position (this
  is known as "double-stepping" or "turnover").
* **Available Rotors (from `rotors.json`):
  * **Rotor I:** Wiring "EKMFLGDQVZNTOWYHXUSPAIBRCJ", Notch "Q"
  * **Rotor II:** Wiring "AJDKSIRUXBLHWTMCQGZNPYFVOE", Notch "E"
  * **Rotor III:** Wiring "BDFHJLCPRTXVZNYEIWGAKMUSQO", Notch "V"
  * **Rotor IV:** Wiring "ESOVPZJAYQUIRHXLNFTGKDCMWB", Notch "J"
  * **Rotor V:** Wiring "VZBRGITYUPSDNHLXAWMJQOFECK", Notch "Z"
* **Example Configuration (from `machineSettings.json`):

    ```json
    "rotors": [
      {
        "name": "IV",
        "ring": 0,
        "position": 9
      },
      {
        "name": "III",
        "ring": 0,
        "position": 21
      },
      {
        "name": "V",
        "ring": 0,
        "position": 25
      }
    ]
    ```

    This indicates the machine uses Rotor IV as the left rotor, Rotor III
    as the middle rotor, and Rotor V as the right rotor, with their
    respective ring settings and initial positions.

### 3. Reflector (Umkehrwalze)

* **Purpose:** The reflector is a fixed wiring component that sends the
  electrical signal back through the rotors in reverse order. It ensures
  that the encryption is reciprocal (encrypting 'A' to 'B' means 'B'
  encrypts to 'A' with the same settings) and that a letter can never be
  encrypted to itself.[^1]
* **Configuration:** This project uses a fixed "UKW-B" reflector
  wiring: "YRUHQSLDPXNGOKMIEBFZCWVJAT".

## Enigma Machine Operation

The `EnigmaMachine` class orchestrates the entire encryption process.

### Initial Setup

The Enigma machine is initialized with a `plugboard`, three `rotors`
(left, middle, right), and a `reflector`. These components are set up
based on the `machineSettings.json` file.

### Processing a Message

When a message is to be encrypted, the `processMessage` method iterates
through each character. For each alphabetic character:

1. **Rotor Advancement:** The `advanceRotors` method is called to step
  the rotors.
1. **Character Processing:** The `processChar` method handles the
  encryption of a single character.

### Signal Path for a Single Character (`processChar`)

The electrical signal representing a character travels through the Enigma
machine in a specific path:

1. **Input to Plugboard:** The initial character enters the `plugboard`.
    If it's part of a connected pair, it's swapped.
1. **Plugboard to Right Rotor:** The signal then enters the `rightRotor`.
    The rotor's current position and ring setting, along with its internal
    wiring, determine the output.
1. **Right Rotor to Middle Rotor:** The signal passes from the
    `rightRotor` to the `middleRotor`, undergoing another substitution.
1. **Middle Rotor to Left Rotor:** The signal continues to the
    `leftRotor` for a third substitution.
1. **Left Rotor to Reflector:** The signal reaches the `reflector`. The
    reflector's fixed wiring sends the signal back, ensuring a reciprocal
    encryption.
1. **Reflector back to Left Rotor (Reverse Pass):** The signal, now
    reflected, travels back through the `leftRotor` in reverse. The
    rotor's wiring is traversed in the opposite direction.
1. **Left Rotor to Middle Rotor (Reverse Pass):** The signal moves from
    the `leftRotor` to the `middleRotor` in reverse.
1. **Middle Rotor to Right Rotor (Reverse Pass):** The signal proceeds
    from the `middleRotor` to the `rightRotor` in reverse.
1. **Right Rotor to Plugboard (Reverse Pass):** The signal exits the
    `rightRotor` and re-enters the `plugboard`. If it's part of a
    connected pair, it's swapped back (or swapped again if it was not
    swapped on the way in).
1. **Plugboard to Output:** The final signal from the plugboard is the
    encrypted character.

#### Rotor Internal Processing

Each rotor performs a substitution based on its internal wiring, current
position, and ring setting. The `utils.js` file provides helper functions
to convert between letter characters (A-Z) and their numerical values
(0-25, where A=0, B=1, ..., Z=25).

Let:

* $C_{in}$: Input character's numerical value (0-25).
* $P$: Rotor's current position (0-25).
* $R$: Rotor's ring setting (0-25).
* $W$: Rotor's wiring (a string representing the permutation, e.g.,
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ").
* `utils.convert(value)`: Function to convert between numerical value
  (0-25) and letter character (A-Z).

**Forward Pass (Signal from Right to Left):**
This occurs when the signal first enters the rotor assembly from the
keyboard side.

$$C_{out} = (\text{utils.convert}(W[(C_{in} + P - R + 26) \% 26]) - P + R + 26) \% 26$$

* **$(C_{in} + P - R + 26) \% 26$**: This calculates the effective index
  on the rotor's internal wiring by adjusting the input character's
  numerical value ($C_{in}$) based on the rotor's current $P$osition and
  $R$ing setting. The `+ 26` ensures the result stays within the
  0-25 range.
* **$W[...]$**: This uses the calculated effective index to look up the
  corresponding character in the rotor's $W$iring.
* **`utils.convert(...)`**: This converts the character obtained from the
  wiring back to its numerical value.
* **$(... - P + R + 26) \% 26$**: This final adjustment accounts for the
  rotor's position and ring setting to determine the output character's
  numerical value from this rotor.

**Reverse Pass (Signal from Left to Right, after Reflector):**
This occurs when the signal returns from the reflector and passes back
through the rotor assembly.

$$C_{out} = (W.indexOf(\text{utils.convert}((C_{in} + P - R + 26) \% 26)) P + R + 26) \% 26$$

* **$(C_{in} + P - R + 26) \% 26$**: Similar to the forward pass, this
  calculates the effective index on the rotor's internal wiring.
* **`utils.convert(...)`**: This converts the numerical effective index
  to its corresponding character.
* **`W.indexOf(...)`**: This finds the *index* of the character (obtained
  from the previous step) within the rotor's wiring. This effectively
  performs the inverse mapping of the rotor's wiring.
* **$(... - P + R + 26) \% 26$**: This final adjustment accounts for the
  rotor's position and ring setting to yield the final output
  character's numerical value for this reverse pass.

### Rotor Advancement Logic (`advanceRotors`)

The rotors advance according to a specific mechanism:

* The `rightRotor` steps forward by one position for every character
  processed.
* If the `rightRotor` is at its "notch" position *before* it steps,
  the `middleRotor` will also step.
* If the `middleRotor` is at its "notch" position *before* it steps
  (due to the right rotor's notch or its own previous step),
  the `leftRotor` will also step. This is the "double-stepping" mechanism,
  where the middle rotor can cause both itself and the left rotor to
  advance.

[^1]: This was a significant weakness of the Enigma machine, which Alan
    Turing and his team at Bletchley Park exploited to help break the
    Enigma code.
