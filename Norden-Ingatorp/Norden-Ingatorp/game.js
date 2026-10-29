var gravity = true
var gameStart = false
var pauseGame = false
var gameEnd = false
var levelSelect = false
var shopOpen = false
var optionsOpen = false
let caveOpen = false
let canSkip = false
let levelSelectMenu
let textBox
let undergroundMultiplier = 1
let canSummon = false
enemyHealth = ''
let attacks = 0
let currentLevel = 0
let currentMap;
let maps = []
let spawnX
let spawnY
let highestUnlockedLevel = 1
let dx
let distance
let resetEnemy
let currentText = ''
let hasPickaxe = false
let isAttackingLaser = false;
let isAttackingRanged = false
let winScreenVisible = false;
let winScreenStartTime;
let creditsPosition;
let bossDefeated = false
let testing = true
let audioMultiplier = 1
let musicMultiplier = 1
let interactionOpacity = 0;
let interactionIncrement = 5; // Controls fade speed
let isPlayerOnInteractiveTile = false;
canSkip = true
function preload() {
  img = loadImage("spritesheet.png");
  mapTiles = loadImage("MapTiles.png")
  img3 = loadImage("MapTiles.png")
  coin = loadImage("moneystash.png")
  goblinSprite = loadImage('goblin_sprite_sheet.png');
  bossSprite = loadImage('boss_sprite_sheet.png');
  background1 = loadImage('background.png');
  spike = loadImage('spike.png');
  portal = loadImage('portal.png');
  lava = loadImage('Lava.png');
  dashIcon = loadImage('dashicon.png');
  fireballIcon = loadImage('fireballicon.jpg');
  cave = loadImage('Cave.png');
  support = loadImage('coconut.jpg');
  castle = loadImage('CastleTiles.png');
  caveBackground = loadImage('caveBackground.png');
  platforms = loadImage('Platforms.webp');
  fire = loadImage('fire.png');
  blockIcon = loadImage('blockicon.png');
  laser = loadImage('laser.jpg');
  pickaxe = loadImage('pickaxe.png');
  sign = loadImage('sign.png');
  fire2 = loadImage('fire2.png');
  miner = loadImage('Miner.png');
  death = loadImage('death.png');
  download = loadImage('backgroundD.jpg');
  gun = loadImage('gun.png');
  bulletShot = loadImage('bullet.png');
  walking = loadSound('Walking.wav');
  laserShot = loadSound("Laser shot.mp3");  
  homingShot = loadSound("Homing projectile attack.mp3");
  massLasers = loadSound("Mass lasers.mp3");
  projectileShot = loadSound("Projectile fire.mp3");
  rotatingLaser = loadSound("Rotating laser.mp3");
  select = loadSound("buttonSelect.wav");
  hover = loadSound("buttonHover.wav");
  gunSounds = loadSound("gunSounds.mp3");
  //music1 = loadSound("music1.mp3");
  music2 = loadSound("music2.ogg");
}

function setup() {
  frameRate(60)
  noSmooth()
  createCanvas(window.screen.width, window.screen.height);
  const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  console.log("Screen width:", screenWidth)
  console.log("Screen height:", screenHeight)
  p = new Sprite(1000, 403);
  healthBar = new HealthBar();
  vision = new Vision(p)
  camera = new Camera();
  maps = [
  map1 = new Map1(0, 0, 16, 16, 16),
  map2 = new Map2(0, 0, 16, 16, 16),
  map3 = new Map3(0, 0, 16, 16, 16),
  map4 = new Map4(0, 0, 16, 16, 16),
  map5 = new Map5(0, 0, 16, 16, 16),
  map6 = new Map6(0, 0, 16, 16, 16)
]
currentMap = maps[currentLevel - 1];
    
  //map1.mapEnemies();
  // make sure menu is defined
  menu = new Menu(width / 2, height / 2);
  gameMenu = new GameMenu(width / 2, height / 2);
  pauseMenu = new PauseMenu(width / 2, height / 2);
  saveButton = new SaveButton(width / 2, height / 2);
  loadButton = new LoadButton(width / 2, height / 2);
  levelSelectMenu = new LevelSelectMenu(width / 2, height / 2);
  shop = new Shop(width / 2, height / 2);
  options = new OptionsMenu(width / 2, height / 2);
  goToNextLevel()
    if(!bossFightStarted){
    //music1.stop()
   music2.loop()
    console.log("test1")
  }
  if(bossFightStarted){
        music2.stop()
    //music1.loop()
    console.log("music playing")
  }
}
function draw() {
  document.body.style.overflow = 'hidden';
  noSmooth()
    projectileShot.setVolume(audioMultiplier * 1.3);
  hover.setVolume(audioMultiplier * 0.5);
  select.setVolume(audioMultiplier * 0.5);
  rotatingLaser.setVolume(audioMultiplier * 0.1);
  massLasers.setVolume(audioMultiplier * 0.2);
  homingShot.setVolume(audioMultiplier * 1.3);
  laserShot.setVolume(audioMultiplier * 0.2);
  walking.setVolume(audioMultiplier * 0.5);
  //music1.setVolume(audioMultiplier * 1);
  music2.setVolume(musicMultiplier * 1);
  gunSounds.setVolume(audioMultiplier * 1);
  if(gameStart == false && shopOpen == false && optionsOpen == false){
    fill(0,0,0)
    rect(0,0,windowWidth,windowHeight)
    menu.draw()
    levelSelectMenu.hide();
    gameMenu.hide()
    pauseMenu.hide()
    saveButton.draw()
    loadButton.draw()
    shop.hide()
    options.hide()
  }
  if(pauseGame == true){
    menu.hide()
    gameMenu.hide()
    pauseMenu.draw()
    saveButton.draw()
    loadButton.draw()
    shop.hide()
    options.hide()
  }
  if(shopOpen == true){
    menu.hide()
    gameMenu.hide()
    pauseMenu.hide()
    saveButton.hide()
    loadButton.hide()
    shop.draw()
    options.hide()
  }
  if(optionsOpen == true){
    menu.hide()
    gameMenu.hide()
    pauseMenu.hide()
    saveButton.hide()
    loadButton.hide()
    shop.hide()
    options.draw()
  }
  if(levelSelect== true && gameStart == false){
    menu.hide()
    gameMenu.hide()
    pauseMenu.hide()
    saveButton.hide()
    loadButton.hide()
    levelSelectMenu.draw()
    shop.hide()
    options.hide()
  }
  if(gameStart == true && pauseGame == false){
    gameMenu.draw()
    pauseMenu.hide()
    if (!bossFightStarted && bossCamera == false) {
      camera.follow(p); // Follow the player normally until the boss fight starts
    }
    if(bossFightStarted && bossDefeated == false){
      camera.lock(1650, -150)
    }
    if(currentLevel == 6){
      camera.lock(0,-200)
    }
    camera.apply(); // Apply camera transformations
    background(185);
    if(currentLevel != 5 && currentLevel != 6 && undergroundMultiplier === 1){
    image(background1,p.x-(window.screen.width/2),p.y-(window.screen.height/2), windowWidth, windowHeight);
    }
    if(currentLevel != 5 && currentLevel != 6 && undergroundMultiplier === 1.5){
    image(caveBackground,p.x-(window.screen.width/4),p.y-(window.screen.height/4), windowWidth/2, windowHeight/2);
    }
    if(currentLevel == 4){
      image(caveBackground,p.x-(window.screen.width/5*3),p.y-(window.screen.height/5*3), windowWidth/5*6, windowHeight/5*6)
    }
    if(currentLevel == 5){
      image(background1,-1100,-100, windowWidth, windowHeight)
      image(download,900,0-274/2,850/2,274/2)
      image(download,900,0-274,850/2,274/2)
      image(download,900,0-(274/2)-274,850/2,274/2)
      image(download,900,0,850/2,274/2)
      image(download,900,0+274/2,850/2,274/2)
      image(download,900,0+274,850/2,274/2)
      image(download,900,0+274+(274/2),850/2,274/2)
      image(download,900,0+274*2,850/2,274/2)
      image(download,900,0+274*2+(274/2),850/2,274/2)
      image(download,900+(850/2),0-274,850/2,274/2)
      image(download,900+(850/2),0-(274/2)-274,850/2,274/2)
      image(download,900+(850/2),0-274/2,850/2,274/2)
      image(download,900+(850/2),0,850/2,274/2)
      image(download,900+(850/2),0+274/2,850/2,274/2)
      image(download,900+(850/2),0+274,850/2,274/2)
      image(download,900+(850/2),0+274+(274/2),850/2,274/2)
      image(download,900+(850/2),0+274*2,850/2,274/2)
      image(download,900+(850/2),0+274*2+(274/2),850/2,274/2)
      image(download,900+850,0-274,850/2,274/2)
      image(download,900+850,0-(274/2)-274,850/2,274/2)
      image(download,900+850,0-274/2,850/2,274/2)
      image(download,900+850,0,850/2,274/2)
      image(download,900+850,0+274/2,850/2,274/2)
      image(download,900+850,0+274,850/2,274/2)
      image(download,900+850,0+274+(274/2),850/2,274/2)
      image(download,900+850,0+274*2,850/2,274/2)
      image(download,900+850,0+274*2+(274/2),850/2,274/2)
      image(download,900+850+(850/2),0-274,850/2,274/2)
      image(download,900+850+(850/2),0-(274/2)-274,850/2,274/2)
      image(download,900+850+(850/2),0-274/2,850/2,274/2)
      image(download,900+850+(850/2),0,850/2,274/2)
      image(download,900+850+(850/2),0+274/2,850/2,274/2)
      image(download,900+850+(850/2),0+274,850/2,274/2)
      image(download,900+850+(850/2),0+274+(274/2),850/2,274/2)
      image(download,900+850+(850/2),0+274*2,850/2,274/2)
      image(download,900+850+(850/2),0+274*2+(274/2),850/2,274/2)
      image(download,900+850+850,0-274,850/2,274/2)
      image(download,900+850+850,0-(274/2)-274,850/2,274/2)
      image(download,900+850+850,0-274/2,850/2,274/2)
      image(download,900+850+850,0,850/2,274/2)
      image(download,900+850+850,0+274/2,850/2,274/2)
      image(download,900+850+850,0+274,850/2,274/2)
      image(download,900+850+850,0+274+(274/2),850/2,274/2)
      image(download,900+850+850,0+274*2,850/2,274/2)
      image(download,900+850+850,0+274*2+(274/2),850/2,274/2)
      image(download,900+850+850+(850/2),0-274,850/2,274/2)
      image(download,900+850+850+(850/2),0-(274/2)-274,850/2,274/2)
      image(download,900+850+850+(850/2),0-274/2,850/2,274/2)
      image(download,900+850+850+(850/2),0,850/2,274/2)
      image(download,900+850+850+(850/2),0+274/2,850/2,274/2)
      image(download,900+850+850+(850/2),0+274,850/2,274/2)
      image(download,900+850+850+(850/2),0+274+(274/2),850/2,274/2)
      image(download,900+850+850+(850/2),0+274*2,850/2,274/2)
      image(download,900+850+850+(850/2),0+274*2+(274/2),850/2,274/2)
      image(download,900+850+850+850,0-274,850/2,274/2)
      image(download,900+850+850+850,0-(274/2)-274,850/2,274/2)
      image(download,900+850+850+850,0-274/2,850/2,274/2)
      image(download,900+850+850+850,0,850/2,274/2)
      image(download,900+850+850+850,0+274/2,850/2,274/2)
      image(download,900+850+850+850,0+274,850/2,274/2)
      image(download,900+850+850+850,0+274+(274/2),850/2,274/2)
      image(download,900+850+850+850,0+274*2,850/2,274/2)
      image(download,900+850+850+850,0+274*2+(274/2),850/2,274/2)
      
      
    }
    currentMap.drawTileMap();
    currentMap.updateEnemies(p);
    currentMap.updateBoss(p);
    currentMap.updateUnderground()
    if(currentLevel != 5&&currentLevel != 6 && !(undergroundMultiplier === 1 && (currentLevel == 3 || currentLevel == 2))&& currentLevel != 1){
    vision.draw(p);
    }
    healthBar.draw(p.currentHealth, p.maxHealth);
        updateInteractionText(p)
    drawInteractionText()
    p.attack();
    p.draw();
    p.move(currentMap);
    p.updateSpeed();
    p.regenerate();
  }
}
function saveGame() {
  let saveData = {
    attacks,
    enemyHealth: currentMap.tiles.flat().filter(tile => tile instanceof Enemy2).map(enemy => enemy.enemyHealth)
  };
  let blob = new Blob([JSON.stringify(saveData)], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "prototype_save.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function loadGame() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = event => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      let saveData = JSON.parse(e.target.result);
      attacks = saveData.attacks;
      currentLevel = saveData.currentLevel;
      currentMap = maps[currentLevel - 1];
      let enemyIndex = 0;
      currentMap.tiles.forEach((row, y) => {
        row.forEach((tile, x) => {
          if (tile instanceof Enemy2) {
            tile.enemyHealth = saveData.enemyHealth[enemyIndex++];
          }
        });
      });
    };
    reader.readAsText(file);
  };
  input.click();
}

function goToNextLevel() {
  bossFightStarted = false
        currentLevel++
    if(currentLevel == 1){
  spawnX = 1300
  spawnY = 863
}
if(currentLevel == 2){
  spawnX = 2600
  spawnY = 2140
}
if(currentLevel == 3){
  spawnX = 1360
  spawnY = 767
}
if(currentLevel == 4){
  spawnX = 1000
  spawnY = 403
}
  if(currentLevel == 5){
    spawnX = 0
    spawnY = 300
  }
  if(currentLevel == 6){
    spawnX = 0
    spawnY = 0
  }
        currentMap = maps[currentLevel - 1];
    console.log("working")
  resetPlayerPosition()
}


function resetPlayerPosition() {
    bossFightStarted = false
  p.x = spawnX
  p.y = spawnY
  p.vx = 0;
  p.vy = 0;
  p.currentHealth = p.maxHealth;
  p.isAttacking = false;
  p.attackTimer = false;
}
function gameOver() {
  console.log("Game Over. Resetting level.");
  setTimeout(() =>{
      pauseGame.isDead = false
      p.currentDeathFrame = 0
      p.isDeathAnimationComplete = false; // End of death animation
      resetPlayerPosition()
          pauseGame.isDead = false
      p.currentDeathFrame = 0
      p.isDeathAnimationComplete = false; // End of death animation
  },1000/13)
}
function goToCurrentLevelStart() {
    bossFightStarted = false
  currentMap = maps[currentLevel - 1]; // Reset current map to its initial state as needed
  resetPlayerPosition(); // Re-initialize player's position and state
  resetEnemy = true
}
function playerEnteredPortal() {
  console.log("Congratulations, you have completed this level and may now move on to the next one!");
  // Mark the current level as completed
  if (!levelCompleted[currentLevel]) {
    levelCompleted[currentLevel] = true;
    if (currentLevel < levelCompleted.length) {
      levelCompleted[currentLevel] = true; // Unlock the next level
    }
  }
    if (currentLevel === 5) {
    currentLevel = 6;
    goToCurrentLevelStart();
  } else {
    // Redirect the player back to the main menu
    redirectToMainMenu();
  }
}
function redirectToMainMenu() {
  pauseMenu.startGame()
}
// Assuming you have some mechanism to call this when a player enters a level-end portal
 function startBossFight() {
    console.log("Boss fight started!");
    bossFightStarted = true;
        camera.lock(1600, -100);
 }
function updateInteractionText() {
  // Check if the player is on a portal or summoning tile
  const tileX = Math.floor(p.x / currentMap.tileSize);
  const tileY = Math.floor(p.y / currentMap.tileSize);
  
  // Check for pickaxe collision
  if (currentMap.tiles[tileY] && currentMap.tiles[tileY][tileX] === 65) {
    hasPickaxe = true;
    currentMap.tiles[tileY][tileX] = undefined;
  }
  
  if (tileY < currentMap.tiles.length && tileX < currentMap.tiles[tileY].length) {
    const currentTile = currentMap.tiles[tileY][tileX];
    if (currentTile === 18 || (currentTile === 30 && currentLevel === 5)){
      currentText = 'Press Q to interact'
    }
    if (currentTile === 42){
      currentText = 'Maybe there is another\n way over there'
    }
    if (currentTile === 43){
      currentText = "test 3"
    }
    if (currentTile === 44){
      currentText = "test 4"
    }
    if (currentTile === 45){
      currentText = "test 5"
    }
    if (currentTile === 46){
      currentText = "If you can find my pickaxe,\nI can open up the mines.\nI think it's in the tunnels."
    }
    isPlayerOnInteractiveTile = (currentTile === 18 || (currentTile === 30 && currentLevel === 5) || ((currentTile >= 42 && currentTile <= 46) && currentLevel === 3));
  } else {
    isPlayerOnInteractiveTile = false; // Ensuring the state is reset if out of bounds
  }
  // Adjust opacity based on player's position
  if (isPlayerOnInteractiveTile) {
    interactionOpacity = Math.min(255, interactionOpacity + interactionIncrement); // Fade in
  } else {
    interactionOpacity = Math.max(0, interactionOpacity - interactionIncrement); // Fade out
  }
}
function drawInteractionText() {
  if (interactionOpacity > 0) {
    noSmooth()
      push();
      image(sign, p.x - 780, p.y - 370, 200, 200)
      fill(255, 255, 255, interactionOpacity); // White text with varying opacity
      textAlign(CENTER, CENTER);
      textFont('papyrus')
      textSize(15);
      text(currentText, p.x - 680, p.y - 300); // Display at top center
      pop();
  }
}