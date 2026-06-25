# ♊ Cloudmon: Retrofit the 90s (Google Cloud 8-Bit RPG Sandbox)

Welcome to **Cloudmon: Retrofit the 90s**, a nostalgic, fully-playable, self-contained 2D browser-based RPG designed in the pixel-perfect aesthetic of 1990s Game Boy Pokémon games. 

In this game, traditional fantasy monsters are replaced with **Google Cloud Platform (GCP) products and services** (Cloud Spanner, BigQuery, Cloud Run, GKE, Vertex AI). Your mission as a Developer/Cloud Engineer is to traverse the digital overworld, encounter wild unconfigured services, and safely "deploy" (capture) them into your **Cloud-Dex** by demonstrating expert product mastery in a retro **Cloud Quiz**!

---

## 🕹️ Core Game Mechanics

### 1. Overworld Exploration (The Player)
- **The Developer Hero:** Control a classic retro-styled Developer traversing a 24x24 sector sandbox grid.
- **Interactive Terrain:** 
  - 💾 **Floppy Disk Grass (Tall Grass):** Walking through floppy disk grass has a 15% chance to intercept an anomalous network packet, triggering a wild Cloudmon encounter.
  - 🖥️ **Server Rack Blocks (Obstacles):** solid, humming mainframe towers that restrict routing boundaries.
  - 🔌 **Dial-up Modem Portal (Spawn & Recharge Hub):** Landing on this central console (coordinates 12,12) re-establishes a stable handshake and restores your Quota SLA HP back to 5/5 immediately!

### 2. The Battle Platform Encounter
- When an encounter is triggered, the overworld seamlessly fades out through a pixelated sweep transition accompanied by a chiptune siren.
- Transition into a classic split-screen battle deck:
  - **Your Developer Sprite** faces away in the bottom-left quadrant.
  - **Encountered Cloudmon Sprite** faces forward on a glowing platform in the top-right quadrant.
  - Classic retro scrolling text boxes display system actions (e.g., `"A wild BigQuery appeared!"`).

### 3. The Capture Mechanic: Cloud Quiz
Instead of physical combat, you capture (deploy) a Cloudmon by demonstrating absolute capability parameters.
- Choose **CAPTURE** from the battle deck to launch the **Quiz Engine**.
- **The Quiz:** Generates **3 consecutive multiple-choice questions** specific to that GCP product's capabilities, SLAs, limits, and underlying architectures.
- **Interactive Timer:** A 15-second retro sliding countdown ticks away. Failing to answer in time counts as an exception error (wrong)!
- **Capture Success:** Answering all 3 questions correctly triggers a happy chiptune fanfare and integrates the service into your permanent **Cloud-Dex**!
- **Capture Failure:** Getting a question wrong triggers a crash. The Cloudmon escapes and your **Quota SLA HP** decreases by 1.

### 4. Player Stats & Cloud-Dex
- **Quota SLA HP:** You start with 5 Quota points. If it hits 0, a critical system outage occurs, throwing a highly-detailed, humorous **1990s Windows Blue Screen of Death (BSOD)** detailing process and memory dump failures with a **REBOOT SYSTEM** prompt!
- **Interactive Cloud-Dex:** An active dashboard panel displays which products have been compiled. Locked services display encrypted messages, while captured modules unlock in-depth 90s specifications.

---

## 🎨 Premium Visual & Audio Aesthetics

- **Dual Rendering Screen Themes:**
  - 🟢 **Game Boy Classic:** A nostalgic monochrome green palette that retro-maps all multi-colored procedural pixels to authentic Game Boy values based on brightness.
  - 🔵 **Color Retro:** A vibrant, NES-like 8-bit layout displaying custom Google Cloud brand colors (Blue, Red, Yellow, Green, Purple) in crisp pixel-art formats.
- **Native 8-Bit Web Audio Synthesizer:**
  - Standard browsers have 100% zero audio asset dependencies!
  - Plays retro chiptune background music (BGM) via a dual-channel step sequencer (Channel 1: Pulse melody, Channel 2: Triangle Bass).
  - High-fidelity sound effects (SFX) synthesize footsteps, grass rustles, encounter sirens, correct answers, wrong answers, and capture fanfares dynamically using browser oscillators.

---

## 🚀 How to Run and Play Instantly

This project is fully self-contained. You do not need compilation pipelines, Docker containers, or Node modules to run it. You can double-click `index.html` to run it directly, or spin up a lightweight web server.

### Option A: Open Directly in Browser
Simply double-click or drag and drop the `index.html` file from the `/Users/tonyruiz/agy_demo/ce-hackathon/` directory into any modern web browser.

### Option B: Spin up a Local Dev Server (Recommended for audio context stability)
You can run a lightweight server from the terminal in the project directory:

```bash
# Using Python (Pre-installed on macOS/Linux)
python3 -m http.server 8080

# Or using Node.js (npx serve)
npx -y serve

# Or using PHP
php -S localhost:8080
```

Once running, navigate to `http://localhost:8080` in your web browser.

---

## ⌨️ Controls Cheat Sheet

You can play completely using the **tactile physical buttons on the 3D Game Boy Color mockup** (fully responsive to mouse clicks and touch taps!), or use your keyboard:

| Action | Keyboard Key | Game Boy Mockup Button |
|---|---|---|
| **Move Up / Select Option** | `W` / `Arrow Up` | **D-Pad Up** |
| **Move Down / Select Option** | `S` / `Arrow Down` | **D-Pad Down** |
| **Move Left / Select Option** | `A` / `Arrow Left` | **D-Pad Left** |
| **Move Right / Select Option** | `D` / `Arrow Right` | **D-Pad Right** |
| **OK / Confirm Choice** | `ENTER` | **Button A (OK)** |
| **Run / Escape / Back** | `ESC` | **Button B (RUN)** |
| **BGM Handshake Sound** | `SHIFT` | **SELECT** |
| **Interact / Inspect Facing Tile** | `SPACEBAR` | **START** |

---

## 📂 Project Architecture

```
ce-hackathon/
├── index.html       # Handheld Game Boy Color mockup, responsive layout & controllers
├── style.css        # (Optional) Tailored visual tokens (mostly Tailwind inline utilities used)
├── game.js          # Main loop, camera coordinates, battle states, and movement controllers
├── sprites.js       # Procedural 16x16 8-bit sprite drawings and dual-theme palettes
├── questions.js     # Multiple choice curriculum pools with detailed product explanations
├── sound.js         # Custom Web Audio API dual-channel synthesizer and SFX wave generators
└── README.md        # Technical specifications and walkthrough guidance
```

---

## 🛡️ Gemini Quality Assurance Compliance
- **Identity & Access Security:** Strictly client-side sandboxed. No data is stored externally, preserving complete user confidentiality.
- **Operational Resilience:** Bulletproof input validation and error catch-blocks protect against canvas rendering and sound-card execution faults.
- **Semantic HTML5:** Built on standard canvas and button semantic models, providing full cross-browser progressive enhancements.

*Have fun traversing the retro overworld and rebooting the 90s!*
# ce-hackathon-repo
