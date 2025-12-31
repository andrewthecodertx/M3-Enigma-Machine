class EnigmaUI {
  isProduction =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  constructor() {
    this.currentRotorPositions = [0, 0, 0]; // [left, middle, right]
    this.initialRotorPositions = [0, 0, 0];
    this.API_URL = isProduction
      ? "https://andrewthecoder.com/enigmaserver/"
      : `${window.location.origin}`;

    this.initializeElements();
    this.attachEventListeners();
    this.loadDefaultSettings();
  }

  initializeElements() {
    // Rotor elements
    this.leftRotorType = document.getElementById("leftRotorType");
    this.middleRotorType = document.getElementById("middleRotorType");
    this.rightRotorType = document.getElementById("rightRotorType");

    this.leftRotorRing = document.getElementById("leftRotorRing");
    this.middleRotorRing = document.getElementById("middleRotorRing");
    this.rightRotorRing = document.getElementById("rightRotorRing");

    this.leftRotorPosition = document.getElementById("leftRotorPosition");
    this.middleRotorPosition = document.getElementById("middleRotorPosition");
    this.rightRotorPosition = document.getElementById("rightRotorPosition");

    // Plugboard
    this.plugboardInput = document.getElementById("plugboardInput");
    this.plugboardError = document.getElementById("plugboardError");

    // Messages
    this.inputMessage = document.getElementById("inputMessage");
    this.outputMessage = document.getElementById("outputMessage");

    // Buttons
    this.processBtn = document.getElementById("processBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.loadSettingsBtn = document.getElementById("loadSettingsBtn");
    this.copyBtn = document.getElementById("copyBtn");

    // Keyboard and lampboard
    this.keys = document.querySelectorAll(".key");
    this.lamps = document.querySelectorAll(".lamp");
  }

  attachEventListeners() {
    // Process message button
    this.processBtn.addEventListener("click", () => this.processMessage());

    // Reset button
    this.resetBtn.addEventListener("click", () => this.resetRotors());

    // Load settings button
    this.loadSettingsBtn.addEventListener("click", () =>
      this.loadDefaultSettings(),
    );

    // Copy button
    this.copyBtn.addEventListener("click", () => this.copyOutput());

    // Keyboard buttons
    this.keys.forEach((key) => {
      key.addEventListener("click", () => {
        const letter = key.dataset.key;
        this.processSingleCharacter(letter);
      });
    });

    // Physical keyboard support
    document.addEventListener("keydown", (e) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        e.preventDefault();
        this.processSingleCharacter(letter);
        this.pressKey(letter);
      }
    });

    document.addEventListener("keyup", (e) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        this.releaseKey(letter);
      }
    });

    // Plugboard validation
    this.plugboardInput.addEventListener("input", () =>
      this.validatePlugboard(),
    );

    // Auto-uppercase plugboard input
    this.plugboardInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  async loadDefaultSettings() {
    try {
      const response = await fetch("data/machineSettings.json");
      const settings = await response.json();

      // Set rotors
      this.leftRotorType.value = settings.rotors[0].name;
      this.middleRotorType.value = settings.rotors[1].name;
      this.rightRotorType.value = settings.rotors[2].name;

      // Set rings
      this.leftRotorRing.value = settings.rotors[0].ring;
      this.middleRotorRing.value = settings.rotors[1].ring;
      this.rightRotorRing.value = settings.rotors[2].ring;

      // Set positions
      this.currentRotorPositions = [
        settings.rotors[0].position,
        settings.rotors[1].position,
        settings.rotors[2].position,
      ];
      this.initialRotorPositions = [...this.currentRotorPositions];
      this.updateRotorDisplays();

      // Set plugboard
      this.plugboardInput.value = settings.plugboard.join(" ");
      this.validatePlugboard();

      console.log("Default settings loaded successfully");
    } catch (error) {
      console.error("Error loading default settings:", error);
      // Set some reasonable defaults
      this.resetToFactoryDefaults();
    }
  }

  resetToFactoryDefaults() {
    this.leftRotorType.value = "IV";
    this.middleRotorType.value = "III";
    this.rightRotorType.value = "V";

    this.leftRotorRing.value = 0;
    this.middleRotorRing.value = 0;
    this.rightRotorRing.value = 0;

    this.currentRotorPositions = [9, 21, 25];
    this.initialRotorPositions = [...this.currentRotorPositions];
    this.updateRotorDisplays();

    this.plugboardInput.value = "AZ BY CX TD SW";
    this.validatePlugboard();
  }

  validatePlugboard() {
    const input = this.plugboardInput.value.trim();
    const pairs = input.split(/\s+/).filter((p) => p.length > 0);

    if (pairs.length > 10) {
      this.plugboardError.textContent = "Maximum 10 plug pairs allowed";
      return false;
    }

    const usedLetters = new Set();
    for (const pair of pairs) {
      if (pair.length !== 2) {
        this.plugboardError.textContent = `Invalid pair: ${pair}. Each pair must be exactly 2 letters.`;
        return false;
      }

      if (!/^[A-Z]{2}$/.test(pair)) {
        this.plugboardError.textContent = `Invalid pair: ${pair}. Only letters A-Z allowed.`;
        return false;
      }

      if (pair[0] === pair[1]) {
        this.plugboardError.textContent = `Invalid pair: ${pair}. Cannot connect a letter to itself.`;
        return false;
      }

      if (usedLetters.has(pair[0]) || usedLetters.has(pair[1])) {
        this.plugboardError.textContent = `Letter used multiple times in plugboard.`;
        return false;
      }

      usedLetters.add(pair[0]);
      usedLetters.add(pair[1]);
    }

    this.plugboardError.textContent = "";
    return true;
  }

  getSettings() {
    const plugboardPairs = this.plugboardInput.value
      .trim()
      .split(/\s+/)
      .filter((p) => p.length === 2);

    return {
      plugboard: plugboardPairs,
      rotors: [
        {
          name: this.leftRotorType.value,
          ring: parseInt(this.leftRotorRing.value),
          position: this.currentRotorPositions[0],
        },
        {
          name: this.middleRotorType.value,
          ring: parseInt(this.middleRotorRing.value),
          position: this.currentRotorPositions[1],
        },
        {
          name: this.rightRotorType.value,
          ring: parseInt(this.rightRotorRing.value),
          position: this.currentRotorPositions[2],
        },
      ],
      reflector: "UKW-B",
    };
  }

  async processMessage() {
    if (!this.validatePlugboard()) {
      return;
    }

    const message = this.inputMessage.value.toUpperCase();
    if (!message) {
      alert("Please enter a message to process");
      return;
    }

    // Reset rotors to initial positions before processing
    this.currentRotorPositions = [...this.initialRotorPositions];
    this.updateRotorDisplays();

    try {
      const settings = this.getSettings();

      const response = await fetch(`${this.API_URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: settings,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.outputMessage.value = data.result;

      // Update rotor positions after processing (simulate the final state)
      await this.updateRotorPositionsAfterMessage(message);
    } catch (error) {
      console.error("Error processing message:", error);
      alert(
        "Error communicating with Enigma server. Make sure the server is running on port 4000.",
      );
    }
  }

  async processSingleCharacter(letter) {
    if (!this.validatePlugboard()) {
      return;
    }

    try {
      const settings = this.getSettings();

      const response = await fetch(`${this.API_URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: settings,
          message: letter,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const outputLetter = data.result;

      // Light up the corresponding lamp
      this.lightLamp(outputLetter);

      // Advance the rotors (simplified - right rotor always advances)
      this.advanceRotors();

      // Add to output
      this.outputMessage.value += outputLetter;
    } catch (error) {
      console.error("Error processing character:", error);
    }
  }

  advanceRotors() {
    // Simplified rotor advancement (right rotor always advances)
    // In a full implementation, this would check for notch positions
    this.currentRotorPositions[2] = (this.currentRotorPositions[2] + 1) % 26;

    // Check for middle rotor advancement (simplified)
    if (this.currentRotorPositions[2] === 0) {
      this.currentRotorPositions[1] = (this.currentRotorPositions[1] + 1) % 26;

      // Check for left rotor advancement
      if (this.currentRotorPositions[1] === 0) {
        this.currentRotorPositions[0] =
          (this.currentRotorPositions[0] + 1) % 26;
      }
    }

    this.updateRotorDisplays();
  }

  async updateRotorPositionsAfterMessage(message) {
    // Count alphabetic characters
    const alphaCount = message.replace(/[^A-Z]/g, "").length;

    // Simplified: just advance right rotor by the count
    for (let i = 0; i < alphaCount; i++) {
      this.advanceRotors();
    }
  }

  updateRotorDisplays() {
    this.leftRotorPosition.textContent = this.positionToLetter(
      this.currentRotorPositions[0],
    );
    this.middleRotorPosition.textContent = this.positionToLetter(
      this.currentRotorPositions[1],
    );
    this.rightRotorPosition.textContent = this.positionToLetter(
      this.currentRotorPositions[2],
    );
  }

  positionToLetter(position) {
    return String.fromCharCode(65 + position);
  }

  resetRotors() {
    this.currentRotorPositions = [...this.initialRotorPositions];
    this.updateRotorDisplays();
    this.outputMessage.value = "";
    console.log("Rotors reset to initial positions");
  }

  lightLamp(letter) {
    // Remove any existing active lamps
    this.lamps.forEach((lamp) => lamp.classList.remove("active"));

    // Find and light the corresponding lamp
    const lamp = document.querySelector(`.lamp[data-letter="${letter}"]`);
    if (lamp) {
      lamp.classList.add("active");

      // Remove the active class after animation
      setTimeout(() => {
        lamp.classList.remove("active");
      }, 500);
    }
  }

  pressKey(letter) {
    const key = document.querySelector(`.key[data-key="${letter}"]`);
    if (key) {
      key.classList.add("pressed");
    }
  }

  releaseKey(letter) {
    const key = document.querySelector(`.key[data-key="${letter}"]`);
    if (key) {
      key.classList.remove("pressed");
    }
  }

  async copyOutput() {
    try {
      await navigator.clipboard.writeText(this.outputMessage.value);

      // Visual feedback
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = "Copied!";
      this.copyBtn.style.background =
        "linear-gradient(145deg, #4caf50, #388e3c)";

      setTimeout(() => {
        this.copyBtn.textContent = originalText;
        this.copyBtn.style.background = "";
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard");
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const enigma = new EnigmaUI();
  console.log("Enigma Machine UI initialized");
});
