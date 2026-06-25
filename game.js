// Cloudmon Game Engine
// Core game controller managing overworld traversal, camera, battles, quiz loops, and rendering state.

class CloudmonGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.scale = 3; // upscale pixels
    this.tileSize = 16 * this.scale; // 48x48 pixel tiles
    
    // Grid viewport dimensions (10x9)
    this.viewportWidth = 10;
    this.viewportHeight = 9;
    
    // Map dimensions (24x24 tiles)
    this.mapSize = 24;
    this.map = [];
    
    // Game States: 'LOADING', 'OVERWORLD', 'TRANSITION', 'BATTLE', 'GAMEOVER', 'VICTORY'
    this.state = 'LOADING';
    this.isGameBoyMode = true; // true: green screen, false: retro color
    
    // Player State
    this.player = {
      gridX: 5,
      gridY: 5,
      canvasX: 5 * 16 * 3,
      canvasY: 5 * 16 * 3,
      dir: 'Down', // 'Down', 'Up', 'Left', 'Right'
      isMoving: false,
      moveProgress: 0, // 0 to 1
      moveSpeed: 0.08, // step increment per frame
      stepToggle: false, // for foot animation
      quota: 5, // HP
      maxQuota: 5
    };
    
    // Camera coordinates (top-left tile scroll)
    this.camera = {
      x: 0,
      y: 0
    };
    
    // Encounterable Cloudmon Registry (All possible Dex entries)
    this.cloudmonList = [
      "Compute Engine", "GKE", "GKE Autopilot",
      "Cloud SQL", "Cloud Spanner",
      "Cloud Functions", "Cloud Run",
      "BigQuery", "Vertex AI"
    ];
    
    // Wild services that spawn in overworld
    this.wildCloudmonList = ["Compute Engine", "Cloud SQL", "Cloud Functions", "BigQuery", "Vertex AI"];

    // Evolution chain mapping
    this.evolutionMap = {
      "Compute Engine": "GKE",
      "GKE": "GKE Autopilot",
      "Cloud SQL": "Cloud Spanner",
      "Cloud Functions": "Cloud Run"
    };

    // Player Inventory / Cloud-Dex (Captured Cloudmon)
    this.cloudDex = {}; // format: { "BigQuery": true, "GKE": false }
    this.cloudmonData = {
      "BigQuery": {
        name: "BigQuery",
        pillar: "AI & Analytics",
        desc: "Serverless data warehouse. Runs SQL queries across petabytes of logs in seconds. Columnar storage architecture allows rapid analytics without infrastructure management.",
        launchYear: "2011"
      },
      "Cloud Spanner": {
        name: "Cloud Spanner",
        pillar: "Storage & DB",
        desc: "Enterprise relational database. Combines absolute SQL transaction consistency (ACID) with global, horizontal scale-out. Backed by synchronized atomic clocks.",
        launchYear: "2012"
      },
      "Cloud Run": {
        name: "Cloud Run",
        pillar: "Compute",
        desc: "Fully managed serverless container runtime. Scales containers to zero automatically. Perfect for stateless APIs and microservices without cluster maintenance.",
        launchYear: "2019"
      },
      "GKE": {
        name: "GKE",
        pillar: "Compute",
        desc: "Google Kubernetes Engine. The gold standard for managed container orchestrations. Features rapid scaling, secure networking, and hands-off Autopilot mode.",
        launchYear: "2015"
      },
      "Vertex AI": {
        name: "Vertex AI",
        pillar: "AI & Analytics",
        desc: "Unified Machine Learning and GenAI suite. Hosts foundation models like Gemini, coordinates pipelines, stores features, and serves low-latency inferences.",
        launchYear: "2021"
      },
      "Compute Engine": {
        name: "Compute Engine",
        pillar: "Compute",
        desc: "Secure, customizable virtual machine instances in Google's global data centers. Offers fine-grained control over OS, CPU, RAM, and block storage.",
        launchYear: "2012"
      },
      "GKE Autopilot": {
        name: "GKE Autopilot",
        pillar: "Compute",
        desc: "Fully managed Kubernetes cluster deployment mode. Google manages node provisioning, scaling, health, and security upgrades automatically.",
        launchYear: "2020"
      },
      "Cloud SQL": {
        name: "Cloud SQL",
        pillar: "Storage & DB",
        desc: "Fully managed relational database service supporting MySQL, PostgreSQL, and SQL Server with automatic patching, backups, and failover replication.",
        launchYear: "2011"
      },
      "Cloud Functions": {
        name: "Cloud Functions",
        pillar: "Compute",
        desc: "Event-driven serverless Function-as-a-Service (FaaS). Executes modular code snippets dynamically in response to web requests or cloud event streams.",
        launchYear: "2017"
      }
    };
    
    // Init empty dex
    this.cloudmonList.forEach(m => { this.cloudDex[m] = false; });
    
    // Battle State
    this.battle = {
      cloudmon: null, // name of encountered cloudmon
      questions: [], // list of 3 quiz questions
      currentQuestionIdx: 0,
      selectedOptionIdx: 0,
      timer: 15, // seconds left
      timerIntervalId: null,
      substate: 'INTRO', // 'INTRO', 'MENU', 'QUESTION', 'EXPLANATION', 'CAP_SUCCESS', 'CAP_FAIL'
      menuSelection: 0, // 0: Capture, 1: Run
      explanationText: "",
      correctCount: 0,
      cliCharges: {
        gcloud: 1,
        kubectl: 1,
        terraform: 1
      },
      cliSelection: 0,
      logsRevealed: false,
      eliminatedOptions: []
    };
    
    // Screen Transition effects
    this.transitionFrame = 0;
    this.maxTransitionFrames = 40;
    
    // Keys pressed
    this.keys = {};

    // Pillar color configurations for Color Retro mode
    this.pillarThemes = {
      "Compute": {
        accentColor: "#4285f4", // GCP Blue
        platformBg: "rgba(66, 133, 244, 0.18)",
        borderCol: "#4285f4",
        badgeBg: "rgba(66, 133, 244, 0.15)",
        badgeBorder: "rgba(66, 133, 244, 0.3)"
      },
      "Storage & DB": {
        accentColor: "#34a853", // GCP Green
        platformBg: "rgba(52, 168, 83, 0.18)",
        borderCol: "#34a853",
        badgeBg: "rgba(52, 168, 83, 0.15)",
        badgeBorder: "rgba(52, 168, 83, 0.3)"
      },
      "AI & Analytics": {
        accentColor: "#a142f4", // Vertex Purple
        platformBg: "rgba(161, 66, 244, 0.18)",
        borderCol: "#a142f4",
        badgeBg: "rgba(161, 66, 244, 0.15)",
        badgeBorder: "rgba(161, 66, 244, 0.3)"
      }
    };
    
    // Dialogue box variables
    this.dialogueText = "";
    this.dialogueCallback = null;
    this.dialogueScrollIdx = 0;
    this.dialogueTimer = 0;
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Setup Canvas Resolution (10 tiles x 9 tiles, upscaled by scale=3)
    this.canvas.width = this.viewportWidth * this.tileSize; // 480px
    this.canvas.height = this.viewportHeight * this.tileSize; // 432px
    
    this.generateMap();
    this.setupListeners();
    this.updateCamera(true);
    
    this.state = 'OVERWORLD';
    
    // Start Game Loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  generateMap() {
    // Generate a 24x24 map
    // 0 = path, 1 = grass, 2 = server rack, 3 = modem portal
    for (let r = 0; r < this.mapSize; r++) {
      this.map[r] = [];
      for (let c = 0; c < this.mapSize; c++) {
        // Borders are Server Racks
        if (r === 0 || r === this.mapSize - 1 || c === 0 || c === this.mapSize - 1) {
          this.map[r][c] = 2;
        } else if (r === 12 && c === 12) {
          // Centered dial-up modem portal
          this.map[r][c] = 3;
        } else {
          // Generate patches of floppy grass, server blocks, and paths
          const rand = Math.random();
          if (rand < 0.22) {
            this.map[r][c] = 1; // Grass
          } else if (rand < 0.28) {
            this.map[r][c] = 2; // Server rack obstacles
          } else {
            this.map[r][c] = 0; // Empty floor
          }
        }
      }
    }
    
    // Ensure starting area (surrounding (5,5)) is clear of obstacles
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const nr = 5 + dr;
        const nc = 5 + dc;
        if (nr > 0 && nr < this.mapSize - 1 && nc > 0 && nc < this.mapSize - 1) {
          this.map[nr][nc] = (Math.random() < 0.4) ? 1 : 0; // standard floor or grass
        }
      }
    }
    this.map[5][5] = 0; // Spawn is clear floor
  }

  setupListeners() {
    // Keyboard listeners
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      this.handleKeyDown(e.key);
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Touch/click binding for Game Boy physical overlay buttons
    const bindBtn = (id, keyName) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.keys[keyName] = true;
          this.handleKeyDown(keyName);
        });
        btn.addEventListener('mouseup', () => {
          this.keys[keyName] = false;
        });
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.keys[keyName] = true;
          this.handleKeyDown(keyName);
        });
        btn.addEventListener('touchend', () => {
          this.keys[keyName] = false;
        });
      }
    };

    bindBtn('gb-up', 'ArrowUp');
    bindBtn('gb-down', 'ArrowDown');
    bindBtn('gb-left', 'ArrowLeft');
    bindBtn('gb-right', 'ArrowRight');
    bindBtn('gb-btn-a', 'Enter');
    bindBtn('gb-btn-b', 'Escape');
    bindBtn('gb-btn-select', 'Shift');
    bindBtn('gb-btn-start', ' ');

    // Canvas click detection for direct touch / mouse interactions
    this.canvas.addEventListener('click', (e) => {
      e.preventDefault();
      soundSystem.resumeContext();

      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      if (this.state === 'BATTLE') {
        if (this.battle.substate === 'INTRO' || this.battle.substate === 'EXPLANATION' || 
            this.battle.substate === 'CAP_SUCCESS' || this.battle.substate === 'CAP_FAIL' || this.battle.substate === 'CON_RECOVERY') {
          // Click anywhere in dialog box to progress
          if (clickY >= 260) {
            this.handleBattleInput('Enter');
          }
        } else if (this.battle.substate === 'MENU') {
          if (clickY >= 260) {
            if (clickY < 355) {
              this.battle.menuSelection = 0;
              this.clickBattleOption(0);
            } else {
              this.battle.menuSelection = 1;
              this.clickBattleOption(1);
            }
          }
        } else if (this.battle.substate === 'CLI_MENU') {
          if (clickY >= 310 && clickY < 400) {
            const index = Math.floor((clickY - 310) / 22);
            if (index >= 0 && index < 4) {
              this.battle.cliSelection = index;
              this.selectCliCommand();
            }
          }
        } else if (this.battle.substate === 'QUESTION') {
          if (clickY >= 320) { // Options grid area
            const col = clickX < 240 ? 0 : 1;
            const row = clickY < 370 ? 0 : 1;
            const index = row * 2 + col;
            
            // Check if option was eliminated by terraform
            if (!this.battle.eliminatedOptions || !this.battle.eliminatedOptions.includes(index)) {
              this.battle.selectedOptionIdx = index;
              this.submitAnswer();
            } else {
              soundSystem.playWrongBuzz();
            }
          }
        }
      } else if (this.state === 'GAMEOVER' || this.state === 'VICTORY') {
        this.rebootSystem();
      }
    });
  }

  handleKeyDown(key) {
    // If browser audio needs resuming
    soundSystem.resumeContext();

    if (this.state === 'OVERWORLD') {
      if (key === 'Shift') {
        // SELECT button plays cool dial-up sound handshake!
        soundSystem.playEncounter();
        this.addTextLog("Dial-up handshake initiated... SYN ACK.");
      }
      if (key === ' ' || key === 'Enter') {
        // Talk / Inspect action
        this.inspectTile();
      }
    } else if (this.state === 'BATTLE') {
      this.handleBattleInput(key);
    } else if (this.state === 'GAMEOVER') {
      if (key === 'Enter' || key === ' ') {
        this.rebootSystem();
      }
    } else if (this.state === 'VICTORY') {
      if (key === 'Enter' || key === ' ') {
        this.rebootSystem();
      }
    }
  }

  inspectTile() {
    // Find what tile the player is facing
    let targetX = this.player.gridX;
    let targetY = this.player.gridY;
    if (this.player.dir === 'Up') targetY--;
    if (this.player.dir === 'Down') targetY++;
    if (this.player.dir === 'Left') targetX--;
    if (this.player.dir === 'Right') targetX++;

    if (targetX < 0 || targetX >= this.mapSize || targetY < 0 || targetY >= this.mapSize) return;

    const tile = this.map[targetY][targetX];
    if (tile === 2) {
      soundSystem.playWalk();
      this.addTextLog("Server Node: Blinking lights indicate 100% capacity. Safe sandbox.");
    } else if (tile === 3 || (this.player.gridX === 12 && this.player.gridY === 12)) {
      // Heal at the portal!
      soundSystem.playCorrectChime();
      this.player.quota = this.player.maxQuota;
      this.updateUI();
      this.addTextLog("SYS_REBOOT: Server connection restored! Quota HP restored to 5/5!");
    }
  }

  addTextLog(text) {
    const consoleLogs = document.getElementById('console-logs');
    if (consoleLogs) {
      const p = document.createElement('p');
      p.className = 'border-b border-green-950/20 py-1 text-xs font-mono text-green-800 dark:text-green-400';
      p.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
      consoleLogs.insertBefore(p, consoleLogs.firstChild);
      
      // limit logs to 10
      while (consoleLogs.children.length > 10) {
        consoleLogs.removeChild(consoleLogs.lastChild);
      }
    }
  }

  rebootSystem() {
    soundSystem.playCorrectChime();
    this.player.quota = 5;
    this.player.gridX = 5;
    this.player.gridY = 5;
    this.player.canvasX = 5 * this.tileSize;
    this.player.canvasY = 5 * this.tileSize;
    this.player.isMoving = false;
    this.player.moveProgress = 0;
    
    // Clear Cloud-Dex captures to let them play again
    this.cloudmonList.forEach(m => { this.cloudDex[m] = false; });
    
    this.state = 'OVERWORLD';
    this.generateMap();
    this.updateCamera(true);
    this.updateUI();
    this.addTextLog("Core Sandbox initialized. Walk grass to find Cloudmon.");
  }

  // --- OVERWORLD PHYSICS & MOVEMENT ---

  updatePlayer(dt) {
    if (this.player.isMoving) {
      // Interpolate canvas coordinates
      this.player.moveProgress += this.player.moveSpeed;
      
      let startX = this.player.gridX * this.tileSize;
      let startY = this.player.gridY * this.tileSize;
      let endX = startX;
      let endY = startY;
      
      if (this.player.dir === 'Left') endX -= this.tileSize;
      if (this.player.dir === 'Right') endX += this.tileSize;
      if (this.player.dir === 'Up') endY -= this.tileSize;
      if (this.player.dir === 'Down') endY += this.tileSize;
      
      this.player.canvasX = startX + (endX - startX) * this.player.moveProgress;
      this.player.canvasY = startY + (endY - startY) * this.player.moveProgress;
      
      if (this.player.moveProgress >= 1) {
        // Finished step
        this.player.isMoving = false;
        this.player.moveProgress = 0;
        
        // Finalize coordinates
        if (this.player.dir === 'Left') this.player.gridX--;
        if (this.player.dir === 'Right') this.player.gridX++;
        if (this.player.dir === 'Up') this.player.gridY--;
        if (this.player.dir === 'Down') this.player.gridY++;
        
        this.player.canvasX = this.player.gridX * this.tileSize;
        this.player.canvasY = this.player.gridY * this.tileSize;
        
        // Animate feet toggle
        this.player.stepToggle = !this.player.stepToggle;
        
        // Check triggers on landing tile
        this.checkTileTrigger();
      }
    } else {
      // Idle - check inputs
      let dx = 0;
      let dy = 0;
      let newDir = null;
      
      if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
        dx = -1;
        newDir = 'Left';
      } else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
        dx = 1;
        newDir = 'Right';
      } else if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
        dy = -1;
        newDir = 'Up';
      } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
        dy = 1;
        newDir = 'Down';
      }
      
      if (newDir) {
        this.player.dir = newDir;
        const targetX = this.player.gridX + dx;
        const targetY = this.player.gridY + dy;
        
        // Check map limits
        if (targetX >= 0 && targetX < this.mapSize && targetY >= 0 && targetY < this.mapSize) {
          const targetTile = this.map[targetY][targetX];
          if (targetTile !== 2) { // 2 = Server Obstacle
            // Trigger moving
            this.player.isMoving = true;
            this.player.moveProgress = 0;
          } else {
            // bump obstacle sound
            if (Math.random() < 0.15) soundSystem.playWalk();
          }
        }
      }
    }
    
    this.updateCamera();
  }

  updateCamera(forceImmediate = false) {
    // Camera centers on player
    // Ideal camera top-left cell
    const targetCamX = this.player.canvasX - (this.viewportWidth / 2 - 0.5) * this.tileSize;
    const targetCamY = this.player.canvasY - (this.viewportHeight / 2 - 0.5) * this.tileSize;
    
    if (forceImmediate) {
      this.camera.x = targetCamX;
      this.camera.y = targetCamY;
    } else {
      // Smooth camera interpolation
      this.camera.x += (targetCamX - this.camera.x) * 0.15;
      this.camera.y += (targetCamY - this.camera.y) * 0.15;
    }
    
    // Lock camera bounds to map borders
    const maxCamX = (this.mapSize * this.tileSize) - (this.viewportWidth * this.tileSize);
    const maxCamY = (this.mapSize * this.tileSize) - (this.viewportHeight * this.tileSize);
    
    this.camera.x = Math.max(0, Math.min(maxCamX, this.camera.x));
    this.camera.y = Math.max(0, Math.min(maxCamY, this.camera.y));
  }

  checkTileTrigger() {
    const tile = this.map[this.player.gridY][this.player.gridX];
    
    if (tile === 1) { // Floppy Disk Grass
      soundSystem.playGrassStep();
      
      // 15% Chance of wild encounter
      if (Math.random() < 0.15) {
        this.triggerEncounter();
      }
    } else if (tile === 3) {
      // Reached dial-up portal! Heal player
      soundSystem.playCorrectChime();
      this.player.quota = this.player.maxQuota;
      this.updateUI();
      this.addTextLog("⚡ Dial-up Portal loaded. CPU Sandbox rebooted! Quota fully restored!");
    }
  }

  triggerEncounter() {
    this.state = 'TRANSITION';
    this.transitionFrame = 0;
    
    soundSystem.playEncounter();
    this.addTextLog("⚡ WARNING: Anomalous network packet detected in Grass. High congestion!");
  }

  startBattle() {
    this.state = 'BATTLE';
    
    // Choose a random wild Cloudmon that hasn't been captured/evolved yet
    let available = this.wildCloudmonList.filter(m => {
      if (m === "Compute Engine") {
        return !this.cloudDex["Compute Engine"] && !this.cloudDex["GKE"] && !this.cloudDex["GKE Autopilot"];
      }
      if (m === "Cloud SQL") {
        return !this.cloudDex["Cloud SQL"] && !this.cloudDex["Cloud Spanner"];
      }
      if (m === "Cloud Functions") {
        return !this.cloudDex["Cloud Functions"] && !this.cloudDex["Cloud Run"];
      }
      return !this.cloudDex[m];
    });
    if (available.length === 0) available = this.wildCloudmonList;
    
    const chosenName = available[Math.floor(Math.random() * available.length)];
    
    // Load quiz questions
    const pool = getQuizForService(chosenName);
    
    this.battle.cloudmon = chosenName;
    this.battle.questions = pool;
    this.battle.currentQuestionIdx = 0;
    this.battle.selectedOptionIdx = 0;
    this.battle.substate = 'INTRO';
    this.battle.menuSelection = 0;
    this.battle.correctCount = 0;
    this.battle.cliCharges = { gcloud: 1, kubectl: 1, terraform: 1 };
    this.battle.cliSelection = 0;
    this.battle.logsRevealed = false;
    this.battle.eliminatedOptions = [];
    delete this.battle.baseCloudmon;
    delete this.battle.evolvedCloudmon;
    
    this.addTextLog(`🔥 ENCOUNTER: Wild ${chosenName} appeared on the network port!`);
  }

  startEvolutionBattle(baseName, evolvedName) {
    this.state = 'BATTLE';
    
    // Load the special evolution question from evolutionQuestions
    const q = evolutionQuestions[baseName];
    
    this.battle.cloudmon = evolvedName; // we show the evolved version facing them
    this.battle.questions = [q]; // only 1 question for evolution
    this.battle.currentQuestionIdx = 0;
    this.battle.selectedOptionIdx = 0;
    this.battle.substate = 'EVO_INTRO';
    this.battle.baseCloudmon = baseName;
    this.battle.evolvedCloudmon = evolvedName;
    this.battle.correctCount = 0;
    this.battle.cliCharges = { gcloud: 1, kubectl: 1, terraform: 1 };
    this.battle.cliSelection = 0;
    this.battle.logsRevealed = false;
    this.battle.eliminatedOptions = [];
    
    soundSystem.playEncounter();
    this.addTextLog(`⚙️ MODERNIZATION: Initiated upgrade checklist for ${baseName} -> ${evolvedName}!`);
  }

  openCliMenu() {
    this.battle.substate = 'CLI_MENU';
    this.battle.cliSelection = 0;
    
    // Pause timer interval
    if (this.battle.timerIntervalId) {
      clearInterval(this.battle.timerIntervalId);
      this.battle.timerIntervalId = null;
    }
  }

  closeCliMenu() {
    this.battle.substate = 'QUESTION';
    
    // Resume timer interval
    if (this.battle.timerIntervalId) clearInterval(this.battle.timerIntervalId);
    this.battle.timerIntervalId = setInterval(() => {
      this.battle.timer--;
      if (this.battle.timer <= 0) {
        clearInterval(this.battle.timerIntervalId);
        this.submitTimeOut();
      }
    }, 1000);
  }

  selectCliCommand() {
    const sel = this.battle.cliSelection;
    if (sel === 0) {
      // gcloud auth login
      if (this.battle.cliCharges.gcloud > 0) {
        this.battle.cliCharges.gcloud = 0;
        this.player.quota = Math.min(this.player.maxQuota, this.player.quota + 1);
        soundSystem.playCorrectChime();
        this.updateUI();
        this.addTextLog(`[CLI] Run: gcloud auth login. Authenticated developer. Restored 1 Quota HP.`);
      } else {
        soundSystem.playWrongBuzz();
      }
    } else if (sel === 1) {
      // kubectl logs
      if (this.battle.cliCharges.kubectl > 0) {
        this.battle.cliCharges.kubectl = 0;
        this.battle.logsRevealed = true;
        this.battle.timer = Math.max(1, this.battle.timer - 5);
        soundSystem.playCorrectChime();
        this.addTextLog(`[CLI] Run: kubectl logs. Pulled stdout logs. Answer index highlighted. Cost: 5s.`);
        this.closeCliMenu();
      } else {
        soundSystem.playWrongBuzz();
      }
    } else if (sel === 2) {
      // terraform apply
      if (this.battle.cliCharges.terraform > 0) {
        this.battle.cliCharges.terraform = 0;
        soundSystem.playCorrectChime();
        
        // Eliminate 2 wrong choices
        const q = this.battle.questions[this.battle.currentQuestionIdx];
        const correct = q.correctAnswer;
        
        const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== correct);
        // Shuffle wrong indices and take 2
        const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
        this.battle.eliminatedOptions = shuffled.slice(0, 2);
        
        // Ensure selection cursor is not on an eliminated option
        if (this.battle.eliminatedOptions.includes(this.battle.selectedOptionIdx)) {
          this.battle.selectedOptionIdx = correct;
        }
        
        this.addTextLog(`[CLI] Run: terraform apply. Orchestrated state: eliminated 2 wrong choices.`);
        this.closeCliMenu();
      } else {
        soundSystem.playWrongBuzz();
      }
    } else if (sel === 3) {
      // BACK
      soundSystem.playWalk();
      this.closeCliMenu();
    }
  }

  // --- BATTLE ENGINE & QUIZ FLOW ---

  handleBattleInput(key) {
    if (this.battle.substate === 'INTRO') {
      if (key === 'Enter' || key === ' ') {
        this.battle.substate = 'MENU';
        soundSystem.playWalk();
      }
    } else if (this.battle.substate === 'EVO_INTRO') {
      if (key === 'Enter' || key === ' ') {
        soundSystem.playWalk();
        this.startQuizQuestion(0);
      }
    } else if (this.battle.substate === 'MENU') {
      if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'w' || key === 's') {
        this.battle.menuSelection = this.battle.menuSelection === 0 ? 1 : 0;
        soundSystem.playWalk();
      }
      if (key === 'Enter' || key === ' ') {
        if (this.battle.menuSelection === 0) {
          // CAPTURE -> launch Quiz!
          soundSystem.playCorrectChime();
          this.startQuizQuestion(0);
        } else {
          // RUN
          soundSystem.playWalk();
          this.addTextLog("Network packet bypassed. Disconnected connection safely.");
          this.state = 'OVERWORLD';
        }
      }
    } else if (this.battle.substate === 'CLI_MENU') {
      if (key === 'ArrowUp' || key === 'w') {
        this.battle.cliSelection = (this.battle.cliSelection - 1 + 4) % 4;
        soundSystem.playWalk();
      } else if (key === 'ArrowDown' || key === 's') {
        this.battle.cliSelection = (this.battle.cliSelection + 1) % 4;
        soundSystem.playWalk();
      } else if (key === 'Enter' || key === ' ') {
        this.selectCliCommand();
      } else if (key === 'Escape') {
        soundSystem.playWalk();
        this.closeCliMenu();
      }
    } else if (this.battle.substate === 'QUESTION') {
      let newSel = this.battle.selectedOptionIdx;
      if (key === 'ArrowLeft' || key === 'a') {
        if (newSel % 2 === 1) newSel--;
      } else if (key === 'ArrowRight' || key === 'd') {
        if (newSel % 2 === 0) newSel++;
      } else if (key === 'ArrowUp' || key === 'w') {
        if (newSel >= 2) newSel -= 2;
      } else if (key === 'ArrowDown' || key === 's') {
        if (newSel < 2) newSel += 2;
      }
      
      // If selection is valid and not eliminated, accept it
      if (newSel !== this.battle.selectedOptionIdx && 
          (!this.battle.eliminatedOptions || !this.battle.eliminatedOptions.includes(newSel))) {
        this.battle.selectedOptionIdx = newSel;
        soundSystem.playWalk();
      }
      
      if (key === 'Enter' || key === ' ') {
        this.submitAnswer();
      } else if (key === 'Escape') {
        soundSystem.playWalk();
        this.openCliMenu();
      }
    } else if (this.battle.substate === 'EXPLANATION') {
      if (key === 'Enter' || key === ' ') {
        soundSystem.playWalk();
        // Go to next question or end quiz
        const nextIdx = this.battle.currentQuestionIdx + 1;
        if (nextIdx < 3) {
          this.startQuizQuestion(nextIdx);
        } else {
          // Finished 3 questions. Check win criteria
          if (this.battle.correctCount === 3) {
            this.captureSuccess();
          } else {
            this.captureFailure();
          }
        }
      }
    } else if (this.battle.substate === 'CAP_SUCCESS' || this.battle.substate === 'CAP_FAIL' || this.battle.substate === 'CON_RECOVERY') {
      if (key === 'Enter' || key === ' ') {
        soundSystem.playWalk();
        
        // Go to overworld, or if health=0 go to gameover, or if all captured go to victory!
        if (this.player.quota <= 0) {
          this.state = 'GAMEOVER';
          soundSystem.playGameOverTragedy();
          this.addTextLog("🛑 FATAL ERROR: Core HP reached 0. Service Outage triggered.");
        } else {
          // Check if all 5 captured for Victory!
          const allCaptured = this.cloudmonList.every(m => this.cloudDex[m]);
          if (allCaptured) {
            this.state = 'VICTORY';
            soundSystem.playDeployFanfare();
            this.addTextLog("🎉 OUTSTANDING OUTCOME: Retrofit complete! Cloudmon Sandbox stabilized!");
          } else {
            this.state = 'OVERWORLD';
          }
        }
      }
    }
  }

  // Battle screen mouse/touch clicks
  clickBattleOption(optionIndex) {
    if (this.state !== 'BATTLE') return;
    soundSystem.resumeContext();

    if (this.battle.substate === 'MENU') {
      if (optionIndex === 0) {
        soundSystem.playCorrectChime();
        this.startQuizQuestion(0);
      } else {
        soundSystem.playWalk();
        this.state = 'OVERWORLD';
      }
    } else if (this.battle.substate === 'QUESTION') {
      this.battle.selectedOptionIdx = optionIndex;
      this.submitAnswer();
    } else if (this.battle.substate === 'INTRO') {
      this.battle.substate = 'MENU';
      soundSystem.playWalk();
    } else if (this.battle.substate === 'EVO_INTRO') {
      soundSystem.playWalk();
      this.startQuizQuestion(0);
    } else if (this.battle.substate === 'EXPLANATION') {
      // Progress explanation
      this.handleBattleInput('Enter');
    } else if (this.battle.substate === 'CAP_SUCCESS' || this.battle.substate === 'CAP_FAIL' || this.battle.substate === 'CON_RECOVERY') {
      this.handleBattleInput('Enter');
    }
  }

  startQuizQuestion(index) {
    this.battle.substate = 'QUESTION';
    this.battle.currentQuestionIdx = index;
    this.battle.selectedOptionIdx = 0;
    
    const enemyName = this.battle.cloudmon;
    const enemyData = this.cloudmonData[enemyName];
    const enemyPillar = enemyData ? enemyData.pillar : "Compute";
    const maxTimer = enemyPillar === "Compute" ? 18 : 15;
    this.battle.timer = maxTimer;
    
    // Reset timer interval
    if (this.battle.timerIntervalId) clearInterval(this.battle.timerIntervalId);
    this.battle.timerIntervalId = setInterval(() => {
      this.battle.timer--;
      if (this.battle.timer <= 0) {
        clearInterval(this.battle.timerIntervalId);
        this.submitTimeOut();
      }
    }, 1000);
  }

  submitAnswer() {
    // Clear timer
    if (this.battle.timerIntervalId) clearInterval(this.battle.timerIntervalId);
    
    const q = this.battle.questions[this.battle.currentQuestionIdx];
    const isCorrect = this.battle.selectedOptionIdx === q.correctAnswer;
    
    this.battle.substate = 'EXPLANATION';
    
    if (isCorrect) {
      this.battle.correctCount++;
      soundSystem.playCorrectChime();
      this.battle.explanationText = `CORRECT! ✔️\n${q.explanation}`;
      this.addTextLog(`[Quiz Q${this.battle.currentQuestionIdx+1}] Correctly answered!`);
    } else {
      soundSystem.playWrongBuzz();
      this.battle.explanationText = `WRONG! ❌\nCorrect was: ${q.options[q.correctAnswer]}\n${q.explanation}`;
      this.addTextLog(`[Quiz Q${this.battle.currentQuestionIdx+1}] Wrong answer selected.`);
    }
  }

  submitTimeOut() {
    const q = this.battle.questions[this.battle.currentQuestionIdx];
    this.battle.substate = 'EXPLANATION';
    soundSystem.playWrongBuzz();
    this.battle.explanationText = `TIME OUT! ⌛\nCorrect was: ${q.options[q.correctAnswer]}\n${q.explanation}`;
    this.addTextLog(`[Quiz Q${this.battle.currentQuestionIdx+1}] Time expired.`);
  }

  captureSuccess() {
    this.battle.substate = 'CAP_SUCCESS';
    soundSystem.playDeployFanfare();
    
    const name = this.battle.cloudmon;
    this.cloudDex[name] = true;
    
    this.updateUI();
    this.addTextLog(`🔋 DEPLOYED: Successfully compiled and integrated ${name} to Cloud-Dex!`);
  }

  captureFailure() {
    const name = this.battle.cloudmon;
    const enemyData = this.cloudmonData[name];
    const enemyPillar = enemyData ? enemyData.pillar : "Compute";

    if (enemyPillar === "Storage & DB" && Math.random() < 0.33) {
      this.battle.substate = 'CON_RECOVERY';
      soundSystem.playCorrectChime();
      this.addTextLog(`🔄 HA_CONSENSUS: Read/Write failure on ${name} recovered automatically via secondary replica consensus! Saved SLA quota.`);
      return;
    }

    this.battle.substate = 'CAP_FAIL';
    soundSystem.playEscapeCrash();
    
    // Decrement Quota HP
    this.player.quota--;
    this.updateUI();
    
    this.addTextLog(`🛑 EXCEPTION: ${name} deployment crashed! Decreased Quota HP. Core HP: ${this.player.quota}/5`);
  }

  // --- UI UPDATING ---

  updateUI() {
    // 1. Quota HP displays
    const quotaVal = document.getElementById('ui-quota-hp');
    if (quotaVal) {
      quotaVal.innerText = `${this.player.quota}/5`;
    }
    const bar = document.getElementById('ui-quota-bar');
    if (bar) {
      const percentage = (this.player.quota / 5) * 100;
      bar.style.width = `${percentage}%`;
      // Warning colors
      if (this.player.quota <= 1) {
        bar.className = "h-full bg-red-600 transition-all duration-300";
      } else if (this.player.quota <= 3) {
        bar.className = "h-full bg-yellow-500 transition-all duration-300";
      } else {
        bar.className = "h-full bg-green-500 transition-all duration-300";
      }
    }
    
    // 2. Refresh Cloud-Dex HTML list
    const listContainer = document.getElementById('dex-list');
    if (listContainer) {
      listContainer.innerHTML = '';
      
      this.cloudmonList.forEach(name => {
        const item = this.cloudmonData[name];
        const isCaptured = this.cloudDex[name];
        
        const card = document.createElement('div');
        const pillar = item.pillar || "Compute";
        
        let cardBgClasses = 'bg-gray-100/50 border-dashed border-gray-300 dark:bg-zinc-900/40 dark:border-zinc-800';
        let textNameClasses = 'text-gray-400 dark:text-zinc-600';
        let badgeClasses = 'bg-gray-200 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500';
        let italicTextClasses = 'text-gray-400 dark:text-zinc-600';

        if (isCaptured) {
          if (pillar === "Compute") {
            cardBgClasses = 'bg-blue-50/80 border-blue-600/30 hover:shadow-md hover:bg-blue-100/90 dark:bg-blue-950/20 dark:border-blue-500/40 dark:hover:bg-blue-950/40';
            textNameClasses = 'text-blue-800 dark:text-blue-400';
            badgeClasses = 'bg-blue-200 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            italicTextClasses = 'text-blue-700 dark:text-blue-400';
          } else if (pillar === "Storage & DB") {
            cardBgClasses = 'bg-emerald-50/80 border-emerald-600/30 hover:shadow-md hover:bg-emerald-100/90 dark:bg-emerald-950/20 dark:border-emerald-500/40 dark:hover:bg-emerald-950/40';
            textNameClasses = 'text-emerald-800 dark:text-emerald-400';
            badgeClasses = 'bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            italicTextClasses = 'text-emerald-700 dark:text-emerald-400';
          } else if (pillar === "AI & Analytics") {
            cardBgClasses = 'bg-purple-50/80 border-purple-600/30 hover:shadow-md hover:bg-purple-100/90 dark:bg-purple-950/20 dark:border-purple-500/40 dark:hover:bg-purple-950/40';
            textNameClasses = 'text-purple-800 dark:text-purple-400';
            badgeClasses = 'bg-purple-200 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
            italicTextClasses = 'text-purple-700 dark:text-purple-400';
          }
        }

        const nextEvolution = this.evolutionMap[name];
        const canEvolve = isCaptured && nextEvolution && !this.cloudDex[nextEvolution];

        card.className = `p-3 rounded-lg border-2 font-mono transition-all cursor-pointer select-none ${cardBgClasses}`;
        
        card.innerHTML = `
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm ${textNameClasses}">
              ${isCaptured ? '📂 ' + name + ' (' + pillar + ')' : '❓ [ENCRYPTED]'}
            </span>
            <div class="flex gap-2 items-center">
              ${canEvolve ? `<button class="evolve-btn px-2 py-0.5 bg-yellow-500 text-slate-900 border border-yellow-600 rounded text-[9px] font-bold hover:bg-yellow-400 transition-all font-sans">MODERNIZE</button>` : ''}
              <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${badgeClasses}">
                ${isCaptured ? 'Active' : 'Unstable'}
              </span>
            </div>
          </div>
          <p class="text-[11px] leading-relaxed ${isCaptured ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-400 dark:text-zinc-600'}">
            ${isCaptured ? item.desc : 'Walk through floppy disk grass in the overworld to detect this product and verify its capability parameters.'}
          </p>
          ${isCaptured ? `<div class="text-[9px] ${italicTextClasses} mt-2 italic">Standard sandbox launch: Gen90 (${item.launchYear})</div>` : ''}
        `;
        
        // Add click listener to show captured details on main screen if they click
        card.onclick = () => {
          if (isCaptured) {
            this.addTextLog(`Examing database manifest: ${name}. Standard specifications active.`);
          }
        };

        if (canEvolve) {
          const btn = card.querySelector('.evolve-btn');
          if (btn) {
            btn.onclick = (e) => {
              e.stopPropagation(); // prevent card click
              this.startEvolutionBattle(name, nextEvolution);
            };
          }
        }
        
        listContainer.appendChild(card);
      });
    }
  }

  // --- GAME LOOP & RENDERING ---

  gameLoop(timestamp) {
    this.update(timestamp);
    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(timestamp) {
    if (this.state === 'OVERWORLD') {
      this.updatePlayer(timestamp);
    } else if (this.state === 'TRANSITION') {
      this.transitionFrame++;
      if (this.transitionFrame >= this.maxTransitionFrames) {
        this.startBattle();
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background base color
    this.ctx.fillStyle = this.isGameBoyMode ? "#9bbc0f" : "#121214";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.state === 'OVERWORLD' || this.state === 'TRANSITION') {
      this.renderOverworld();
      if (this.state === 'TRANSITION') {
        this.renderTransitionEffect();
      }
    } else if (this.state === 'BATTLE') {
      this.renderBattle();
    } else if (this.state === 'GAMEOVER') {
      this.renderBSOD();
    } else if (this.state === 'VICTORY') {
      this.renderVictory();
    }
    
    // Render static grid LCD scanlines overlay to make it look hyper-authentic!
    this.renderScanlines();
  }

  renderScanlines() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    for (let y = 0; y < this.canvas.height; y += 3) {
      this.ctx.fillRect(0, y, this.canvas.width, 1);
    }
    
    // Inner bezel shadow
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(1, 1, this.canvas.width-2, this.canvas.height-2);
  }

  renderOverworld() {
    // Compute view ranges based on camera
    const startCol = Math.floor(this.camera.x / this.tileSize);
    const endCol = Math.min(this.mapSize - 1, startCol + this.viewportWidth + 1);
    
    const startRow = Math.floor(this.camera.y / this.tileSize);
    const endRow = Math.min(this.mapSize - 1, startRow + this.viewportHeight + 1);
    
    const offsetX = -this.camera.x;
    const offsetY = -this.camera.y;
    
    // Draw tiles
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.map[r][c];
        const screenX = c * this.tileSize + offsetX;
        const screenY = r * this.tileSize + offsetY;
        
        let spriteId = 'floor';
        if (tile === 1) spriteId = 'grass';
        else if (tile === 2) spriteId = 'server';
        else if (tile === 3) spriteId = 'modem';
        
        drawPixelSprite(this.ctx, spriteId, screenX, screenY, this.scale, this.isGameBoyMode);
      }
    }
    
    // Draw Player
    const playerScreenX = this.player.canvasX + offsetX;
    const playerScreenY = this.player.canvasY + offsetY;
    
    let spriteId = 'playerDown';
    if (this.player.dir === 'Up') spriteId = 'playerUp';
    else if (this.player.dir === 'Left') spriteId = 'playerLeft';
    else if (this.player.dir === 'Right') spriteId = 'playerRight';
    
    drawPixelSprite(this.ctx, spriteId, playerScreenX, playerScreenY, this.scale, this.isGameBoyMode);
  }

  renderTransitionEffect() {
    // Flash white and black or retro green
    const factor = this.transitionFrame / this.maxTransitionFrames;
    this.ctx.fillStyle = `rgba(15, 56, 15, ${factor})`;
    
    // Concentric shrink bars or pixelation blocks
    for (let i = 0; i < 6; i++) {
      const w = this.canvas.width * (1 - factor) * (i / 6);
      const h = this.canvas.height * (1 - factor) * (i / 6);
      this.ctx.strokeStyle = this.isGameBoyMode ? "#0f380f" : "#4285f4";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect((this.canvas.width - w)/2, (this.canvas.height - h)/2, w, h);
    }
  }

  renderBattle() {
    const enemyName = this.battle.cloudmon;
    const enemyData = this.cloudmonData[enemyName];
    const enemyPillar = enemyData ? enemyData.pillar : "Compute";
    const theme = this.pillarThemes[enemyPillar] || this.pillarThemes["Compute"];

    const bg = this.isGameBoyMode ? "#9bbc0f" : "#1a1a24";
    const darkColor = this.isGameBoyMode ? "#0f380f" : "#ffffff";
    const accentColor = this.isGameBoyMode ? "#306230" : theme.accentColor;
    const platformColor = this.isGameBoyMode ? "rgba(48, 98, 48, 0.2)" : theme.platformBg;
    
    // 1. Draw solid background
    this.ctx.fillStyle = bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 2. Draw Battle Platforms (light circles)
    this.ctx.fillStyle = platformColor;
    this.ctx.beginPath();
    this.ctx.ellipse(360, 130, 90, 30, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.ellipse(110, 270, 90, 30, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // 3. Draw Player back sprite (bottom-left)
    // Scale up player sprite for close-up view
    const pScale = 5;
    drawPixelSprite(this.ctx, 'playerUp', 70, 160, pScale, this.isGameBoyMode);
    
    // 4. Draw Wild Cloudmon sprite (top-right)
    drawPixelSprite(this.ctx, enemyName, 310, 40, pScale, this.isGameBoyMode);
    
    // 5. Draw HUD - Enemy Status Box (Top-Left)
    this.ctx.fillStyle = this.isGameBoyMode ? "#8bac0f" : "#212130";
    this.ctx.strokeStyle = darkColor;
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(15, 20, 180, 55);
    this.ctx.strokeRect(15, 20, 180, 55);
    
    this.ctx.fillStyle = darkColor;
    this.ctx.font = '10px "Press Start 2P", monospace';
    this.ctx.fillText(enemyName.toUpperCase(), 25, 36);
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillText("Lv99", 145, 36);
    
    // Enemy Quest Progress dots (3 dots)
    this.ctx.fillText("DEP STABLE:", 25, 50);
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.arc(125 + (i * 14), 48, 4, 0, 2 * Math.PI);
      if (i < this.battle.currentQuestionIdx) {
        // completed
        this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : accentColor;
      } else {
        this.ctx.fillStyle = this.isGameBoyMode ? "#9bbc0f" : "#444444";
      }
      this.ctx.fill();
      this.ctx.strokeStyle = darkColor;
      this.ctx.stroke();
    }
    
    // 6. Draw HUD - Player Status Box (Bottom-Right)
    this.ctx.fillStyle = this.isGameBoyMode ? "#8bac0f" : "#212130";
    this.ctx.fillRect(285, 180, 180, 55);
    this.ctx.strokeRect(285, 180, 180, 55);
    
    this.ctx.fillStyle = darkColor;
    this.ctx.font = '10px "Press Start 2P", monospace';
    this.ctx.fillText("DEV ENGINE", 295, 196);
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillText(`Q_HP:${this.player.quota}/5`, 295, 210);
    
    // Quota visual mini bar
    this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : "#444444";
    this.ctx.fillRect(295, 216, 160, 6);
    const qPct = this.player.quota / 5;
    this.ctx.fillStyle = this.isGameBoyMode ? "#306230" : (this.player.quota <= 1 ? "#ea4335" : (this.player.quota <= 3 ? "#fbbc05" : "#34a853"));
    this.ctx.fillRect(295, 216, 160 * qPct, 6);
    this.ctx.strokeRect(295, 216, 160, 6);
    
    // 7. Render dialogue box (Bottom 30% of screen)
    this.renderBattleDialogue();
  }

  renderBattleDialogue() {
    const enemyName = this.battle.cloudmon;
    const enemyData = this.cloudmonData[enemyName];
    const enemyPillar = enemyData ? enemyData.pillar : "Compute";
    const theme = this.pillarThemes[enemyPillar] || this.pillarThemes["Compute"];

    const darkColor = this.isGameBoyMode ? "#0f380f" : "#ffffff";
    const lightBg = this.isGameBoyMode ? "#e0f8cf" : "#1a1a24";
    const borderCol = this.isGameBoyMode ? "#0f380f" : theme.borderCol;
    
    // Outer Border
    this.ctx.fillStyle = this.isGameBoyMode ? "#8bac0f" : "#14141e";
    this.ctx.strokeStyle = borderCol;
    this.ctx.lineWidth = 4;
    this.ctx.fillRect(10, 260, 460, 160);
    this.ctx.strokeRect(10, 260, 460, 160);
    
    this.ctx.fillStyle = darkColor;
    
    if (this.battle.substate === 'INTRO') {
      this.ctx.font = '11px "Press Start 2P", monospace';
      this.ctx.fillText(`A wild ${this.battle.cloudmon}`, 25, 295);
      this.ctx.fillText(`appeared!`, 25, 315);
      
      this.ctx.font = '8px "Press Start 2P", monospace';
      this.ctx.fillText("▶ Press SPACE/ENTER to test", 25, 380);
      
      // prompt blinking arrow
      this.renderBlinkingArrow(440, 395);
    } else if (this.battle.substate === 'MENU') {
      this.ctx.font = '11px "Press Start 2P", monospace';
      this.ctx.fillText(`What will DEV do?`, 25, 295);
      
      // Render menu options grid
      const opsY1 = 345;
      const opsY2 = 385;
      
      // Draw standard selection brackets
      this.ctx.font = '11px "Press Start 2P", monospace';
      this.ctx.fillText(`${this.battle.menuSelection === 0 ? "▶ " : "  "}CAPTURE (QUIZ)`, 40, opsY1);
      this.ctx.fillText(`${this.battle.menuSelection === 1 ? "▶ " : "  "}RUN (BYPASS)`, 40, opsY2);
      
      this.ctx.font = '7px "Press Start 2P", monospace';
      this.ctx.fillStyle = this.isGameBoyMode ? "#306230" : "#aaaaaa";
      this.ctx.fillText("Use Arrows/WASD, Enter to confirm", 40, 410);
    } else if (this.battle.substate === 'CLI_MENU') {
      this.ctx.font = '9px "Press Start 2P", monospace';
      this.ctx.fillText("DEV CONSOLE COMMANDS:", 25, 290);
      
      const commands = [
        `gcloud auth login   [${this.battle.cliCharges.gcloud ? "1" : "0"}]`,
        `kubectl logs        [${this.battle.cliCharges.kubectl ? "1" : "0"}]`,
        `terraform apply     [${this.battle.cliCharges.terraform ? "1" : "0"}]`,
        "BACK TO QUIZ"
      ];
      
      const descList = [
        "Restores 1 Quota SLA HP point.",
        "Reveals answer checkmark. (Timer -5s)",
        "Orchestrates state: eliminates 2 wrong answers.",
        "Resume and return to the question timer."
      ];
      
      commands.forEach((cmd, index) => {
        const y = 320 + (index * 22);
        if (this.battle.cliSelection === index) {
          this.ctx.fillStyle = this.isGameBoyMode ? "rgba(48, 98, 48, 0.15)" : theme.platformBg;
          this.ctx.fillRect(20, y - 9, 440, 16);
          this.ctx.strokeStyle = darkColor;
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(20, y - 9, 440, 16);
          
          this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : theme.accentColor;
          this.ctx.font = '8px "Press Start 2P", monospace';
          this.ctx.fillText(`▶ ${cmd}`, 25, y);
          
          // Draw helper description at the very bottom
          this.ctx.fillStyle = this.isGameBoyMode ? "#306230" : "#aaaaaa";
          this.ctx.font = '6px "Press Start 2P", monospace';
          this.ctx.fillText(descList[index], 25, 410);
        } else {
          this.ctx.fillStyle = darkColor;
          this.ctx.font = '8px "Press Start 2P", monospace';
          this.ctx.fillText(`  ${cmd}`, 25, y);
        }
      });
    } else if (this.battle.substate === 'QUESTION') {
      const q = this.battle.questions[this.battle.currentQuestionIdx];
      
      // Show question text (wrapped manually for monospace font bounds)
      this.ctx.font = '8px "Press Start 2P", monospace';
      const lines = this.wrapText(q.question, 50);
      lines.forEach((line, index) => {
        this.ctx.fillText(line, 25, 285 + (index * 13));
      });
      
      // Draw options A, B, C, D in a neat clickable grid at the bottom
      this.ctx.font = '7px "Press Start 2P", monospace';
      const optYBase = 340;
      
      const options = q.options;
      
      options.forEach((opt, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 30 + (col * 220);
        const y = optYBase + (row * 35);
        
        const isEliminated = this.battle.eliminatedOptions && this.battle.eliminatedOptions.includes(index);
        const isCorrectChoice = index === q.correctAnswer;
        
        let label = opt;
        if (this.battle.logsRevealed && isCorrectChoice) {
          label = `✔️ ` + label;
        }
        
        // Highlights selection
        if (this.battle.selectedOptionIdx === index && !isEliminated) {
          this.ctx.fillStyle = this.isGameBoyMode ? "rgba(48, 98, 48, 0.15)" : theme.platformBg;
          this.ctx.fillRect(x - 5, y - 10, 210, 24);
          this.ctx.strokeStyle = darkColor;
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(x - 5, y - 10, 210, 24);
          
          this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : theme.accentColor;
        } else {
          this.ctx.fillStyle = isEliminated 
            ? (this.isGameBoyMode ? "#306230" : "#555555") 
            : darkColor;
        }
        
        // Wrap option text in case it's long
        const optLines = this.wrapText(isEliminated ? "---" : label, 28);
        optLines.forEach((oLine, oIdx) => {
          this.ctx.fillText(oLine, x, y + (oIdx * 10));
        });
      });
      
      // Timer bar rendering
      this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : "#aaaaaa";
      this.ctx.fillRect(25, 315, 430, 4);
      const maxTimer = enemyPillar === "Compute" ? 18 : 15;
      const timerPct = this.battle.timer / maxTimer;
      this.ctx.fillStyle = this.battle.timer <= 4 ? "#ea4335" : (this.isGameBoyMode ? "#306230" : theme.accentColor);
      this.ctx.fillRect(25, 315, 430 * timerPct, 4);

      // AI Specialty Hint Display
      if (enemyPillar === "AI & Analytics" && q.hint) {
        this.ctx.fillStyle = this.isGameBoyMode ? "#306230" : "#a142f4";
        this.ctx.font = '6px "Press Start 2P", monospace';
        this.ctx.fillText(`💡 HINT: ${q.hint}`, 25, 328);
      }

      // CLI help footer tip
      this.ctx.fillStyle = this.isGameBoyMode ? "#306230" : "#888888";
      this.ctx.font = '5px "Press Start 2P", monospace';
      this.ctx.fillText("Press B (ESC) for CLI Console", 270, 328);
    } else if (this.battle.substate === 'EXPLANATION') {
      this.ctx.font = '8px "Press Start 2P", monospace';
      
      const lines = this.wrapText(this.battle.explanationText, 52);
      lines.slice(0, 10).forEach((line, index) => {
        this.ctx.fillText(line, 25, 285 + (index * 13));
      });
      
      this.renderBlinkingArrow(440, 400);
    } else if (this.battle.substate === 'CON_RECOVERY') {
      this.ctx.font = '10px "Press Start 2P", monospace';
      this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : "#34a853";
      this.ctx.fillText("HA REPLICA CONSENSUS!", 25, 295);
      
      this.ctx.fillStyle = darkColor;
      this.ctx.font = '8px "Press Start 2P", monospace';
      const lines = this.wrapText(`A critical deployment write exception occurred. However, multi-zone replica consensus automatically recovered the state! Quota SLA saved.`, 50);
      lines.forEach((line, index) => {
        this.ctx.fillText(line, 25, 320 + (index * 13));
      });
      
      this.renderBlinkingArrow(440, 400);
    } else if (this.battle.substate === 'EVO_INTRO') {
      this.ctx.font = '10px "Press Start 2P", monospace';
      this.ctx.fillText("UPGRADE IN PROGRESS...", 25, 295);
      
      this.ctx.font = '8px "Press Start 2P", monospace';
      const lines = this.wrapText(`Modernizing ${this.battle.baseCloudmon} to ${this.battle.evolvedCloudmon}. Ready to check architectural constraints update?`, 50);
      lines.forEach((line, index) => {
        this.ctx.fillText(line, 25, 320 + (index * 13));
      });
      
      this.renderBlinkingArrow(440, 400);
    } else if (this.battle.substate === 'CAP_SUCCESS') {
      const isEvo = this.battle.baseCloudmon !== undefined;
      this.ctx.font = '10px "Press Start 2P", monospace';
      this.ctx.fillText(isEvo ? "MODERNIZE SUCCESS!" : "SUCCESS! DEPLOYED!", 25, 295);
      
      this.ctx.font = '8px "Press Start 2P", monospace';
      const text = isEvo 
        ? `${this.battle.baseCloudmon} evolved into ${this.battle.evolvedCloudmon}! Modernization updates successfully deployed to Cloud-Dex.`
        : `${this.battle.cloudmon} has compiled successfully. Product capability standards stored in Cloud-Dex.`;
      
      const lines = this.wrapText(text, 50);
      lines.forEach((line, index) => {
        this.ctx.fillText(line, 25, 320 + (index * 13));
      });
      
      this.renderBlinkingArrow(440, 400);
    } else if (this.battle.substate === 'CAP_FAIL') {
      const isEvo = this.battle.baseCloudmon !== undefined;
      this.ctx.font = '10px "Press Start 2P", monospace';
      this.ctx.fillText(isEvo ? "MODERNIZE FAILED!" : "SANDBOX CRASHED!", 25, 295);
      
      this.ctx.font = '8px "Press Start 2P", monospace';
      const text = isEvo 
        ? `Architecture upgrade to ${this.battle.evolvedCloudmon} failed. Upgrade scripts rolled back. Quota HP reduced by 1.`
        : `Deployment compilation failed. Connection lost on terminal port. Quota HP reduced by 1. System reboot requested.`;
      
      const lines = this.wrapText(text, 50);
      lines.forEach((line, index) => {
        this.ctx.fillText(line, 25, 320 + (index * 13));
      });
      
      this.renderBlinkingArrow(440, 400);
    }
  }

  renderBlinkingArrow(x, y) {
    if (Math.floor(Date.now() / 350) % 2 === 0) {
      this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : "#4285f4";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + 10, y);
      this.ctx.lineTo(x + 5, y + 8);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  // --- BSOD GAME OVER SCREEN ---

  renderBSOD() {
    // True blue color regardless of Game Boy mode? Or retro green for GB? Let's make it real BSOD Blue!
    this.ctx.fillStyle = "#0000aa";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = '11px "Press Start 2P", monospace';
    this.ctx.fillText("A fatal exception has occurred.", 20, 40);
    this.ctx.fillText("QUOTA_LIMIT_EXCEEDED (0x05)", 20, 60);
    
    this.ctx.font = '7px "Press Start 2P", monospace';
    const lines = [
      "The Google Cloud SDK Sandbox ran out of available Quota Credits.",
      "All background deployments failed to spin up within SLA thresholds.",
      "The system has been suspended to prevent billing leakage.",
      "",
      "TECHNICAL INFORMATION:",
      "*** STOP: 0x000000D1 (CLOUD_RUN_SCHEDULING_ERR)",
      "*** ADDR: 0x4002FFB1 - STACK_OVERFLOW",
      "*** PROCESS: Vertex_AI_Consensus_Pipeline",
      "",
      "PROACTIVE WORKAROUNDS:",
      "* Increase billing quotas inside your dashboard.",
      "* Connect to a Dial-up Modem Portal to recharge system credits.",
      "* Restart server nodes and avoid congested grass sectors."
    ];
    
    lines.forEach((line, index) => {
      this.ctx.fillText(line, 20, 100 + (index * 14));
    });
    
    // Blinking prompt
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      this.ctx.fillStyle = "#ffcc00";
      this.ctx.fillText("▶ PRESS ENTER / CLICK REBOOT BUTTON", 60, 320);
    }
  }

  // --- VICTORY CONGRATULATIONS SCREEN ---

  renderVictory() {
    this.ctx.fillStyle = this.isGameBoyMode ? "#9bbc0f" : "#0d1b2a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const dark = this.isGameBoyMode ? "#0f380f" : "#ffd700";
    const light = this.isGameBoyMode ? "#306230" : "#ffffff";
    
    this.ctx.fillStyle = dark;
    this.ctx.textAlign = "center";
    this.ctx.font = '14px "Press Start 2P", monospace';
    this.ctx.fillText("CONGRATULATIONS!", this.canvas.width / 2, 50);
    this.ctx.font = '10px "Press Start 2P", monospace';
    this.ctx.fillText("YOU RETROFITTED THE 90S!", this.canvas.width / 2, 80);
    
    // Draw golden trophy or big pixel star
    // We can draw a 16x16 trophy in battle scale
    this.ctx.fillStyle = this.isGameBoyMode ? "#0f380f" : "#fbbc05";
    this.ctx.fillRect(this.canvas.width/2 - 20, 120, 40, 30);
    this.ctx.fillRect(this.canvas.width/2 - 30, 110, 60, 10);
    this.ctx.fillRect(this.canvas.width/2 - 5, 150, 10, 20);
    this.ctx.fillRect(this.canvas.width/2 - 25, 170, 50, 10);
    
    this.ctx.fillStyle = light;
    this.ctx.font = '8px "Press Start 2P", monospace';
    const lines = [
      "Successfully deployed all 9 Cloudmon architecture services:",
      "- VMs, Databases, GKE, Serverless, and AI engines.",
      "",
      "You have demonstrated elite product capability parameters,",
      "resolving transactional consensus, scaling, and database",
      "warehousing bottlenecks across the classic overworld.",
      "",
      "Your Cloud-Dex is fully synchronized. Ready for Prod!",
      "",
      "Press START / ENTER to replay the sandbox simulation."
    ];
    
    lines.forEach((line, index) => {
      this.ctx.fillText(line, this.canvas.width / 2, 210 + (index * 13));
    });
    
    this.ctx.textAlign = "left"; // reset
  }

  // --- UTILS ---

  wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = "";
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxChars) {
        currentLine += (currentLine === "" ? "" : " ") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine !== "") {
      lines.push(currentLine);
    }
    return lines;
  }
}

// Global game instance
const game = new CloudmonGame();
