class Menu{
  //menu with the button from the css file that starts the game when clicked
  constructor(x, y){
    this.x = x
    this.y = y
    this.width = 200
    this.height = 100
      
       this.levelSelectButton = createButton("Select Level");
    this.levelSelectButton.position(this.x-100, this.y - 150);
    this.levelSelectButton.size(this.width, this.height);
     this.levelSelectButton.mousePressed(this.levelSelect)
        this.button1 = createButton("Options")
    this.button1.position(this.x-100, this.y)
    this.button1.size(this.width, this.height)
    this.button1.mousePressed(this.options)
        this.button2 = createButton("Close Game")
    this.button2.position(this.x-100, this.y + 300)
    this.button2.size(this.width, this.height)
    this.button2.mousePressed(this.closeGame)  
      this.shopButton = createButton("Open Shop");
    this.shopButton.position(this.x-100, this.y + 150);
    this.shopButton.size(this.width, this.height);
    this.shopButton.mousePressed(this.openShop);
        this.setupHover(this.levelSelectButton);
        this.setupHover(this.button1);
        this.setupHover(this.button2);
        this.setupHover(this.shopButton);
    }
    setupHover(button) {
        button.mouseOver(() => hover.play());
    }
  openShop() {
    select.play()
    shopOpen = true
  }
  startGame(){
    gameStart = true
  }
  options(){
    select.play()
    optionsOpen = true
  }
  closeGame(){
    select.play()
    window.close()
  }
 draw() {
    this.levelSelectButton.show();
    this.button1.show()
    this.button2.show()
   this.shopButton.show();
    // Show additional buttons as needed
  }
  levelSelect(){
    select.play()
    levelSelect = true
  }
  hide(){
    this.levelSelectButton.hide();
        this.button1.hide()
    this.button2.hide()
    this.shopButton.hide();
  }
  
}
class OptionsMenu {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 50;
    this.openedFromPauseMenu = false; // Flag to check if opened from the pause menu
    
    this.backButton = createButton("Back");
    this.backButton.position(this.x-100, this.y + 150);
    this.backButton.size(this.width, this.height);
    this.backButton.mousePressed(() => this.returnBack());
    this.volumeInput = createSlider(0, 10, 10);
    this.volumeInput.position(this.x-100, this.y + 75);
    this.volumeInput.size(this.width);
    this.volumeInput.input(() => this.setVolume());
    this.musicInput = createSlider(0, 10, 10);
    this.musicInput.position(this.x-100, this.y);
    this.musicInput.size(this.width);
    this.musicInput.input(() => this.setMusicVolume());
    this.controlsText = `Game Controls:
    - Move Left: A 
    - Move Right: D 
    - Jump: Space
    - Dash: E
    - Enter Portal: Q
    - Attack: Left Click
    `
        this.setupHover(this.backButton);
    }
    setupHover(button) {
        button.mouseOver(() => hover.play());
    }
  
  returnBack() {
    select.play()
    gameStart = false;
    optionsOpen = false;
  }
  
  setVolume() {
    audioMultiplier = this.volumeInput.value()/10;
    console.log(`Setting volume to: ${audioMultiplier}`);
    
  }
    setMusicVolume() {
    musicMultiplier = this.volumeInput.value()/10;
    console.log(`Setting volume to: ${musicMultiplier}`);
    
  }
  draw() {
    this.backButton.show();
    this.volumeInput.show();
    this.musicInput.show();
    fill(255);
    textSize(16);
    text("Sound Effects Volume",this.x - 150, this.y - 75)
    text("Music Volume",this.x - 150, this.y)
    text(this.controlsText, this.x + 250, this.y); // Adjust x position as needed
  }
  
  hide() {
    this.backButton.hide();
    this.volumeInput.hide();
    this.musicInput.hide();
  }
}
class Shop {
  constructor() {
    this.costOfGun = 5;
    this.costOfHermesBoots = 5;
    this.costOfArmour = 7;
    this.gunButton = createButton(`Purchase Gun ($${this.costOfGun})`);
    this.hermesButton = createButton(`Purchase Hermes Boots ($${this.costOfHermesBoots})`);
    this.armourButton = createButton(`Purchase Armour ($${this.costOfArmour})`);
    this.returnButton = createButton("Return to Game");
    this.gunButton.position(300, 300);
    this.hermesButton.position(300, 400);
    this.armourButton.position(300, 500);
    this.returnButton.position(300, 600);
    this.gunButton.size(200, 50);
    this.hermesButton.size(200, 50);
    this.armourButton.size(200, 50);
    this.returnButton.size(200, 100);
    this.gunButton.mousePressed(() => this.purchaseGun());
    this.hermesButton.mousePressed(() => this.purchaseHermesBoots());
    this.armourButton.mousePressed(() => this.purchaseArmour());
    this.returnButton.mousePressed(() => this.mainMenu());
    this.setupHover(this.gunButton);
    this.setupHover(this.armourButton);
    this.setupHover(this.hermesButton);
    this.setupHover(this.returnButton);
    }
    setupHover(button) {
        button.mouseOver(() => hover.play());
    }
  draw() {
    this.gunButton.show(); // Show the shop button when shop is open
    this.returnButton.show(); // Show the return button when shop is open
    this.hermesButton.show(); // Show the shop button when shop is open
    this.armourButton.show(); // Show the shop button when shop is open
  }
  hide() {
    this.gunButton.hide(); // Hide the shop button
    this.returnButton.hide();
    this.hermesButton.hide();
    this.armourButton.hide();
  }
  mainMenu(){
    select.play()
    shopOpen = false 
    gameStart = false
    pauseGame = false
    levelSelect = false
  }
  purchaseGun() {
    select.play()
    if (p.coinsCollected >= this.costOfGun) {
      p.coinsCollected -= this.costOfGun; // Deduct the cost from coins collected
      p.hasGun = true; // Increase the number of dashes the player has
      this.gunButton.hide()
      console.log("Gun Purchased!");
    } 
    else if (p.hasGun) {
      console.log("Player already has a gun.");
    }else {
      console.log("Not enough collectables to purchase a Gun.");
    }
  }
  purchaseHermesBoots() {
    select.play()
    if (p.coinsCollected >= this.costOfHermesBoots) {
      p.coinsCollected -= this.costOfHermesBoots;
      p.hasHermesBoots = true;
      this.hermesButton.hide();
      console.log("Hermes Boots Purchased!");
    } else {
      console.log("Not enough collectables to purchase Hermes Boots.");
    }
  }
  purchaseArmour() {
    select.play()
    if (p.coinsCollected >= this.costOfArmour) {
      p.coinsCollected -= this.costOfArmour;
      p.hasArmour = true;
      p.armourHitPoints = 50;  // Assume armour starts with 50 hitpoints
      this.armourButton.hide();
      console.log("Armour Purchased!");
    } else {
      console.log("Not enough collectables to purchase Armour.");
    }
  }

}
class GameMenu{
  //menu with the button from the css file that starts the game when clicked
  constructor(x, y){
    this.x = x
    this.y = y
    this.width = 250
    this.height = 100
    this.button = createButton("Pause")
    this.button.position(0,0)
    this.button.size(this.width/2, this.height/2)
    this.button.mousePressed(this.pauseGame)
    this.setupHover(this.button)
    }
    setupHover(button) {
        button.mouseOver(() => hover.play());
    }
  pauseGame(){
    select.play()
    pauseGame = true
  }
  draw(){
    this.button.show()
  }
  hide(){
    this.button.hide()
  }
  
}

class PauseMenu{
  //menu with the button from the css file that starts the game when clicked
  constructor(x, y){
    this.x = x
    this.y = y
    this.width = 200
    this.height = 100
    this.button = createButton("Resume")
    this.button.position(this.x-100, this.y)
    this.button.size(this.width, this.height)
    this.button.mousePressed(this.pauseGame)
        this.button2 = createButton("Back to Main Menu")
    this.button2.position(this.x-100, this.y+150)
    this.button2.size(this.width, this.height)
    this.button2.mousePressed(this.startGame)
        this.setupHover(this.button);
        this.setupHover(this.button2);
    }
    setupHover(button) {
        button.mouseOver(() => hover.play());
    }
  startGame(){
    select.play()
    gameStart = false
    pauseGame = false
    levelSelect = false
    resetPlayerPosition() 
  }
  
  pauseGame(){
    select.play()
    pauseGame = false
  }


  draw(){
    if(pauseGame){
    this.button.show()
    this.button2.show()
  }
  }
  hide(){
    this.button.hide()
    this.button2.hide()
  }
  
}


class SaveButton{
  //menu with the button from the css file that starts the game when clicked
  constructor(x, y){
    this.x = 1500
    this.y = 1
    this.width = 100
    this.height = 63
    this.button = createButton("Save Game")
    this.button.position(this.x, this.y)
    this.button.size(this.width, this.height)
    this.button.mousePressed(this.saveGame)
  }
  saveGame(){
    saveGame()
  }
  draw(){
    this.button.show()
  }
  hide(){
    this.button.hide()
  }
}
class LoadButton{
  //menu with the button from the css file that starts the game when clicked
  constructor(x, y){
    this.x = 1650
    this.y = 1
    this.width = 100
    this.height = 63
    this.button = createButton("Load Game")
    this.button.position(this.x, this.y)
    this.button.size(this.width, this.height)
    this.button.mousePressed(this.loadGame)
  }
  loadGame(){
    loadGame()
  }
  draw(){
    this.button.show()
  }
  hide(){
    this.button.hide()
  }
}
let levelCompleted = [true, false, false, false, false];

class LevelSelectMenu {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 50;
    this.levelButtons = [];
    // Create buttons for the levels
    for (let i = 1; i <= 5; i++) {
      let levelButton = createButton(`Level ${i}`);
      levelButton.position(this.x-100, this.y + (i - 1) * this.height);
      levelButton.size(this.width, this.height);
      levelButton.mousePressed(() => this.selectLevel(i));
      levelButton.disabled = !levelCompleted[i - 1];
      this.levelButtons.push(levelButton);
    }
    this.setupHover(this.levelButtons[0]);
    this.setupHover(this.levelButtons[1]);
    this.setupHover(this.levelButtons[2]);
    this.setupHover(this.levelButtons[3]);
    this.setupHover(this.levelButtons[4]);
    }
    setupHover(button) {
        button.mouseOver(() => hover.play());
    }
  setSpawnCoordinates(level) {
    switch (level) {
      case 1:
        spawnX = 1300;
        spawnY = 863;
        break;
      case 2:
        spawnX = 2600;
        spawnY = 2140;
        break;
      case 3:
          spawnX = 1360
          spawnY = 767
        break;
      case 4:
        spawnX = 1000;
        spawnY = 283;
        break;
      case 5:
        spawnX = 1100;
        spawnY = 600
        break;
      // Add cases for additional levels as needed
      case 6:
        spawnX = 0
        spawnY = 0
        break;
      default:
        spawnX = 1300;
        spawnY = 863;
    }
  }
  selectLevel(level) {
    select.play()
     if(testing){
   levelCompleted = [true, true, true, true, true];
  }
    if (!levelCompleted[level - 1]) {
      console.log("You need to complete the previous level first!");
      return;
    }
    currentLevel = level;
    this.setSpawnCoordinates(level);
    goToCurrentLevelStart();
    gameStart = true;
    this.hide();
  }
  hide() {
    // Hide each level button
    this.levelButtons.forEach(button => button.hide());
  }
      draw() {
    this.levelButtons.forEach((button, index) => {
      button.disabled = !levelCompleted[index];
      button.show();
    });
  }
}