// Cloudmon 8-Bit Pixel Art Assets
// Defines 16x16 pixel sprites for the Overworld player, obstacles, and all GCP Cloudmons.
// Supports both a classic "Game Boy monochrome green" palette and a vibrant GCP-branded "Color Retro" palette.

const spritePalette = {
  // Classic 4-color Game Boy Palette
  gameboy: {
    "k": "#0f380f", // Darkest Green (Black equivalent)
    "d": "#306230", // Dark Green
    "l": "#8bac0f", // Light Green
    "w": "#e0f8cf", // Lightest Green (White/Transparent equivalent)
    "0": "#0f380f",
    "1": "#306230",
    "2": "#8bac0f",
    "3": "#e0f8cf"
  },
  // Vibrant retro color palette matching GCP styles
  color: {
    "k": "#111111", // Black
    "d": "#444444", // Dark Gray
    "l": "#aaaaaa", // Light Gray / Silver
    "w": "#ffffff", // White
    "b": "#4285f4", // GCP Blue
    "r": "#ea4335", // GCP Red
    "y": "#fbbc05", // GCP Yellow
    "v": "#34a853", // GCP Green
    "p": "#a142f4", // Vertex Purple
    "o": "#ff6d00", // Orange (Exhaust/Fire)
    "s": "#0d47a1"  // Deep Blue
  }
};

const sprites = {
  // --- OVERWORLD TILES ---
  
  // Floor (Dotted computer screen matrix)
  floor: [
    "................",
    "................",
    "..k..........k..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "..k..........k..",
    "................",
    "................",
    "................"
  ],

  // Floppy Disk Grass ( Tall weeds with floppy disk shapes peeking out )
  grass: [
    "....k......k....",
    "...kkk....kkk...",
    "..k.k.k..k.k.k..",
    "..k.k.k..k.k.k..",
    ".kkkkkkkkkkkkkk.",
    ".k.kkkkkkkkkk.k.",
    ".k.kwwkkkwwk.k.k",
    ".k.kwwkkkwwk.k.k",
    ".k.kkkkkkkkkk.k.",
    ".k.kkkkwwkkk.k.k",
    ".k.kkkkwwkkk.k.k",
    ".kkkkkkkkkkkkkk.",
    "..k.k.k..k.k.k..",
    "..k.k.k..k.k.k..",
    "...kkk....kkk...",
    "....k......k...."
  ],

  // Server Rack Obstacle (Metal rack with server blades and flashing LEDs)
  server: [
    "kkkkkkkkkkkkkkkk",
    "kllllllllllllllk",
    "klkkkkkkkkkkkklk",
    "klkrrkkykkkkkkklk",
    "klkkkkkkkkkkkklk",
    "klkkkkkkkkkkkklk",
    "klkbbkkvkkkkkkklk",
    "klkkkkkkkkkkkklk",
    "klkkkkkkkkkkkklk",
    "klkrrkkykkkkkkklk",
    "klkkkkkkkkkkkklk",
    "klkkkkkkkkkkkklk",
    "klkbbkkvkkkkkkklk",
    "klkkkkkkkkkkkklk",
    "kllllllllllllllk",
    "kkkkkkkkkkkkkkkk"
  ],

  // Dial-up Modem Portal (An external desktop modem with wires and flashing lights)
  modem: [
    "................",
    "....kkkkkkkk....",
    "...kllllllllk...",
    "..kllllllllllk..",
    ".kkkkkkkkkkkkkk.",
    ".kllllllllllllk.",
    ".klkkkkkkkkkklk.",
    ".klkrrkykkkkklk.",
    ".klkkkkkkkkkklk.",
    ".kllllllllllllk.",
    ".kkkkkkkkkkkkkk.",
    "....kk....kk....",
    "....kk....kk....",
    "...kk......kk...",
    "..kk........kk..",
    ".kk..........kk."
  ],

  // --- PLAYER DEVELOPMENT HERO (16x16 sprites) ---
  
  playerDown: [
    ".....kkkkkk.....",
    "....kwwwwwkk....",
    "....kwwwwwk.k...",
    "....kwwwwwkk....",
    "....kkkkkkk.....",
    "....kdddddk.....",
    "...kkklllkkk....",
    "..k.kddbddk.k...",
    "..k.kddbddk.k...",
    "....klllllk.....",
    "....kdddddk.....",
    "....kdddddk.....",
    "....kk...kk.....",
    "....kl...kl.....",
    "....kl...kl.....",
    "....kk...kk....."
  ],

  playerUp: [
    ".....kkkkkk.....",
    "....kddddddk....",
    "....kddddddk....",
    "....kddddddk....",
    "....kkkkkkkk....",
    "....kdddddk.....",
    "...kkklllkkk....",
    "..k.kdddddk.k...",
    "..k.kdddddk.k...",
    "....klllllk.....",
    "....kdddddk.....",
    "....kdddddk.....",
    "....kk...kk.....",
    "....kl...kl.....",
    "....kl...kl.....",
    "....kk...kk....."
  ],

  playerLeft: [
    "......kkkkkk....",
    ".....kwwwwwkk...",
    ".....kwwwwwkkk..",
    ".....kwwwwwkk...",
    "......kkkkkk....",
    "......kddddk....",
    ".....kkllllkk...",
    "....k.kddddk.k..",
    "....k.kddddk....",
    "......kllllk....",
    "......kddddk....",
    "......kddddk....",
    "......kk..kk....",
    "......kl..kl....",
    "......kl..kl....",
    "......kk..kk...."
  ],

  playerRight: [
    "....kkkkkk......",
    "...kkwwwwwk.....",
    "..kkkwwwwwk.....",
    "...kkwwwwwk.....",
    "....kkkkkk......",
    "....kddddk......",
    "...kkllllkk.....",
    "..k.kddddk.k....",
    "....kddddk.k....",
    "....kllllk......",
    "....kddddk......",
    "....kddddk......",
    "....kk..kk......",
    "....kl..kl......",
    "....kl..kl......",
    "....kk..kk......"
  ],

  // --- CLOUDMON SPRITES (Facing forward for battle/encyclopedia) ---

  // BigQuery (Magnifying glass examining stacked databases/cylinders)
  BigQuery: [
    "......kkkk......",
    "....kkbbbbkk....",
    "...kbbwwwwbbk...",
    "..kbbbbwwbbbbk..",
    "..kbbbbbbbbbbk..",
    "..kkkkkkkkkkkk..",
    "..kllllllllllk..",
    "..klkwwkwwkklk..",
    "..kllllllllllk..",
    "..kkkkkkkkkkkk..",
    "..kddddddddddk..",
    "..kddddddddddk..",
    "..kkkkkkkkkkkk..",
    "......kk........",
    ".......kkkk.....",
    ".........kkkk..."
  ],

  // Cloud Spanner (Wrench interlocking with global planetary grid)
  "Cloud Spanner": [
    "......kkkk......",
    "....kkllllkk....",
    "...kllllllllk...",
    "..kllllkkllllk..",
    "..klllkkkklllk..",
    "..klllkkkklllk..",
    "..kllllkkllllk..",
    "...kllllllllk...",
    "....kkllllkk....",
    "......kkkk......",
    "......kbbk......",
    "......kbbk......",
    "......kbbk......",
    "......kbbk......",
    ".....kkbbkk.....",
    ".....kkkkkk....."
  ],

  // Cloud Run (Stateless Container bursting with velocity rocket wings and fires)
  "Cloud Run": [
    "......kkkk......",
    "....kkbbbbkk....",
    "...kbbbbbbbbk...",
    "..kbbwwkwwbbbk..",
    ".kbbwwwwwwbbbbk.",
    "kkkkkkkkkkkkkkkk",
    "kllkkkkkkkkkkllk",
    "klkkvkkkkvkkkklk",
    "klkkkkkkkkkkkklk",
    "kkkkkkkkkkkkkkkk",
    "....kkkkkkkk....",
    "....kyykkyyk....",
    "....kyykkyyk....",
    "....kooooook....",
    ".....koooook....",
    "......kkkk......"
  ],

  // GKE (Kubernetes Pilot Steering Wheel inside a cargo container/box)
  GKE: [
    "kkkkkkkkkkkkkkkk",
    "kbbbbbbbbbbbbbbk",
    "kbkkkkkkkkkkkkbk",
    "kbklllkkkklllkbk",
    "kbklkwwkkwwklkbk",
    "kbklkkwwkwwkklkbk",
    "kbkkkwwkkwwkkkbk",
    "kbkwwwwkwwwwkbk",
    "kbkkkwwkkwwkkkbk",
    "kbklkkwwkwwkklkbk",
    "kbklkwwkkwwklkbk",
    "kbklllkkkklllkbk",
    "kbkkkkkkkkkkkkbk",
    "kbbbbbbbbbbbbbbk",
    "kkkkkkkkkkkkkkkk",
    "................"
  ],

  // Vertex AI (Glowing neural AI brain connected inside a glowing core network)
  "Vertex AI": [
    "......kkkk......",
    "....kkppppkk....",
    "...kppppppppk...",
    "..kppwppppwppk..",
    "..kppppppppppk..",
    ".kkkppppppppkkk.",
    "kwwkppppppppkwwk",
    "kyykppppppppkyyk",
    "kyykppppppppkyyk",
    "kwwkppppppppkwwk",
    ".kkkppppppppkkk.",
    "..kppppppppppk..",
    "..kppwppppwppk..",
    "...kppppppppk...",
    "....kkppppkk....",
    "......kkkk......"
  ]
};

// Main Drawing Helper
// Takes canvas rendering 2D context, sprite ID, target grid coordinates or physical coordinates,
// upscale multiplier (pixels are drawn larger for retro effect), and whether to render in Game Boy monochrome green.
function drawPixelSprite(ctx, spriteId, targetX, targetY, pixelSize = 2, isGameBoyMode = true) {
  const sprite = sprites[spriteId];
  if (!sprite) return;

  const currentTheme = isGameBoyMode ? "gameboy" : "color";
  const palette = spritePalette[currentTheme];

  // Disable image smoothing for nice crisp retro pixels
  ctx.imageSmoothingEnabled = false;

  for (let row = 0; index = row, row < 16; row++) {
    const line = sprite[row];
    for (let col = 0; col < 16; col++) {
      const char = line[col];
      if (char !== ".") {
        const color = palette[char] || "#ffffff";
        ctx.fillStyle = color;
        ctx.fillRect(
          targetX + (col * pixelSize),
          targetY + (row * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sprites, spritePalette, drawPixelSprite };
}
