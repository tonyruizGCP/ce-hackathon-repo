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
├── index.html              # Handheld Game Boy Color mockup, responsive layout & controllers
├── game.js                 # Main loop, camera coordinates, battle states, and movement controllers
├── sprites.js              # Procedural 16x16 8-bit sprite drawings and dual-theme palettes
├── questions.js            # Multiple choice curriculum pools with detailed product explanations
├── sound.js                # Custom Web Audio API dual-channel synthesizer and SFX wave generators
├── Dockerfile              # Production Nginx image specification for Cloud Run
├── default.conf.template   # Dynamic Nginx server configuration template with strict CSP rules
├── deploy_to_cloud_run.sh  # Complete GCP Cloud Run automated shell script
└── README.md               # Technical specifications and walkthrough guidance
```

---

## ☁️ Cloud Run Deployment (Containerization Pipeline)

"Cloudmon: Retrofit the 90s" is fully containerized and deployable to Google Cloud Run in minutes. The deployment setup packages the application into an ultra-lightweight production Nginx container that dynamically adapts to Cloud Run's requirements.

### 📦 Deployment Artifacts

1. **[Dockerfile](file:///Users/tonyruiz/agy_demo/ce-hackathon/Dockerfile):** 
   - Uses `nginx:alpine` as the base image for a minimal and secure attack surface.
   - Copies all static web files into Nginx's default public directory `/usr/share/nginx/html/`.
   - Uses the official `envsubst` integration inside Alpine Nginx to inject environment variables on startup.
2. **[default.conf.template](file:///Users/tonyruiz/agy_demo/ce-hackathon/gcp/default.conf.template):**
   - Maps Nginx's listen port to `${PORT}`, allowing seamless integration with Cloud Run's dynamic port assignment.
   - Configures high-performance gzip compression to reduce latency.
   - Enforces **Zero-Trust Security Headers**, including:
     - `X-Frame-Options: DENY` (prevents clickjacking)
     - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Content-Security-Policy` (CSP) restricting resource fetching to trusted Google Fonts and Tailwind CDN endpoints.
3. **[deploy_to_cloud_run.sh](file:///Users/tonyruiz/agy_demo/ce-hackathon/gcp/deploy_to_cloud_run.sh):**
   - A fully automated bash script carrying out:
     - Project target configuration (`gcloud config set project`)
     - API enablement (Artifact Registry, Cloud Build, and Cloud Run APIs)
     - Artifact Registry creation for Docker images
     - Serverless compilation upload using Google Cloud Build (`gcloud builds submit`)
     - Public deployment to Google Cloud Run (`gcloud run deploy --allow-unauthenticated`)

### 🚀 Step-by-Step Deployment Guide

Follow these steps to deploy the application directly to your GCP project:

#### 1. Prerequisites
Ensure you have the Google Cloud CLI (`gcloud`) installed and authenticated locally:
```bash
# Login to your Google account
gcloud auth login

# Set your application default credentials (ADC) if necessary
gcloud auth application-default login
```

#### 2. Configure project variables
Open [deploy_to_cloud_run.sh](file:///Users/tonyruiz/agy_demo/ce-hackathon/gcp/deploy_to_cloud_run.sh) and customize variables if deploying to a different project or region:
- `PROJECT_ID`: Default set to `ce-hackathon-500518`
- `REGION`: Default set to `us-central1`
- `SERVICE_NAME`: Default set to `cloudmon-game`

#### 3. Execute the deployment script
Run the shell script directly from your workspace directory:
```bash
bash gcp/deploy_to_cloud_run.sh
```

Upon a successful run, Cloud Build will build the Nginx container, store it in Artifact Registry, and Cloud Run will spin up the container and output a public HTTPS Service URL where your retro Cloudmon RPG is ready to be played!

---

## 🛡️ Gemini Quality Assurance Compliance
- **Identity & Access Security:** Strictly client-side sandboxed. No data is stored externally, preserving complete user confidentiality.
- **Operational Resilience:** Bulletproof input validation and error catch-blocks protect against canvas rendering and sound-card execution faults.
- **Semantic HTML5:** Built on standard canvas and button semantic models, providing full cross-browser progressive enhancements.

*Have fun traversing the retro overworld and rebooting the 90s!*
# ce-hackathon-repo
