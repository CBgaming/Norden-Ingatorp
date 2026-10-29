  class Sprite {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0
    this.vy = 0
    this.ax = 0
    this.ay = 0.1
    this.jumpVelocity = -1.5
    this.frame = 0
    this.tileSize = 32;
    this.animationSpeed = 6;
    this.maxFrame = 8; // number of frames for walking
    this.direction = 0; // 0 up, 1 left, 2 down, 3 right
    this.hitboxWidth = 32;
    this.hitboxHeight = 24;
    this.width = width;
    this.height = height;
    this.playerDamage = 20
    this.canDash = true
    this.dashCooldown = 100 // Max cooldown value
    this.currentDashCooldown = 100 // Current cooldown value
    this.dashEndTime = 0
    this.maxHealth = 100
    this.speed = 3;
    this.baseSpeed = 3;
    this.hasHermesBoots = true;
    this.hasArmour = true;
    this.armourHitPoints = 50;
     this.maxArmourHitPoints = 50;
    this.regenStartTime = 3000; // 3 seconds delay before regen
    this.currentHealth = 100;
    this.accelerationDuration = 2000; // acceleration duration in milliseconds
    this.accelerationEndTime = 0; // time when acceleration should end
    this.accelerationStartTime = 0; // time when acceleration starts
    this.canJump = true
    this.healthRegenRate = 2
    this.shieldRegenRate = 2
    this.hasPickaxe = false
    this.dashDuration = 500
    this.isDashing = false
    this.startX = 800
    this.movedX = this.x-800
    this.coinsCollected = 0; // Initialize coins collected
     this.invincibilityDuration = 0; // 1 second of invincibility after taking damage
    this.lastDamageTime = 0;
    this.coyoteTime = 10
    this.coyoteCounter = 0
    this.hasGun = true
    this.bullets = []
    this.isShooting = false
        this.fireRate = 50; // Fire rate in milliseconds (0.1 seconds)
    this.lastFireTime = 0;
    this.gunLength = 50
    this.attackFrameStart = 0; // Starting frame for attack animation
    this.attackFrameCount = 6; // Number of frames in attack animation
    this.attackFrameDuration = 33; // Duration each frame is shown in milliseconds
    this.attackAnimationTimer = 0;
    this.attackFrame = 0;
    this.walkingPlaying = false
     this.lastFireTime = 0; // Records the last time a bullet was fired
        this.fireCooldown = 100;
    this.isDead = false;
    this.currentDeathFrame = 0; // Current frame index for the death animation
    this.deathAnimationSpeed = 100; // Time in milliseconds between frames
    this.lastDeathFrameTime = 0; // Last time the death frame was updated
    this.isDeathAnimationComplete = false;
    this.hasFireballAbility = true; // Player has fireball ability
    this.lastFireballTime = 0; // Track last fireball cast
    this.fireballCooldown = 500; // Fireball cooldown in milliseconds
    this.fireballs = []; // Array to store active fireballs
  }
   regenerate() {
       const currentTime = millis();
    // Check if more than 1 second has passed since the last damage
    if (currentTime - this.lastDamageTime > 3000) {
        const secondsElapsed = (currentTime - this.lastDamageTime - 3000) / 1000;
        const healthRegenAmount = Math.floor(((millis()/1000) - (this.lastDamageTime/1000)) * this.healthRegenRate);
        const shieldRegenAmount = Math.floor(((millis()/1000) - (this.lastDamageTime/1000)) * this.shieldRegenRate);
        // Regenerate health
        if (this.currentHealth < this.maxHealth) {
            this.currentHealth = Math.min(this.maxHealth, this.currentHealth + (healthRegenAmount/60));
        }
        // Regenerate shield
        if (this.armourHitPoints < this.maxArmourHitPoints) {
            this.armourHitPoints = Math.min(this.maxArmourHitPoints, this.armourHitPoints + (shieldRegenAmount/60));
        }
        // Reset lastDamageTime to prevent accumulating too much regeneration in one update call
        this.lastDamageTime += secondsElapsed * 1000;
    }
  }
  updateSpeed() {
  const currentTime = millis();
    
    if (this.hasHermesBoots) {
      const baseIncreasedSpeed = this.baseSpeed * 1.1; // 10% increase as the base speed with Hermes Boots
      this.accelerationDuration = 2000; // Duration to reach double the speed
      
      if (keyIsDown(65) || keyIsDown(68)) { // If moving left ('A') or right ('D')
        if (this.accelerationStartTime === 0) {
          this.accelerationStartTime = currentTime;
        }
        const elapsedTime = currentTime - this.accelerationStartTime;
        const accelerationFactor = Math.min(elapsedTime / this.accelerationDuration, 1);
        this.speed = baseIncreasedSpeed * (1 + 1.0 * accelerationFactor); // Accelerate up to 200% more of the base speed
      } else {
        this.accelerationStartTime = 0;
        this.speed = baseIncreasedSpeed; // Maintain the 10% increased speed without acceleration
      }
    } else {
      this.speed = this.baseSpeed; // Default speed without Hermes Boots
    }
  }
 moveCheck(direction) {
    let newX = this.x + this.vx;
    let newY = this.y + this.vy;
    switch (direction) {
      case '0':
        newY -= 5;
        break;
      case '2':
        newY += 5;
        break;
      case '1':
        newX -= this.speed;
        break;
      case '3':
        newX += this.speed;
        break;
      default:
        
         break;
        
    }
      if (this.isColliding(newX, this.y, currentMap)) {
      this.x = newX;
    }
    if (this.isColliding(this.x, newY, currentMap)) {
      this.y = newY;
    }
   
  }
   isColliding(newX, newY, map) {
    let playerTop = newY
    let playerBottom = newY + this.hitboxHeight + 16
    let playerLeft = newX;
    let playerRight = newX + this.hitboxWidth;
    let tileX = Math.floor(newX / this.tileSize);
    let tileY = Math.floor(newY / this.tileSize);
    if (
      tileX < 0 ||
      tileX >= map.tiles[0].length ||
      tileY < 0 ||
      tileY >= map.tiles.length
    ) {
      return false; // Collision with boundary
    }
    for (let y = tileY; y < tileY +1; y++) {
      for (let x = tileX; x < tileX +1; x++) {
        if (map.tiles[y] && map.tiles[y][x] !== undefined) {
      let tileTop = tileY * this.tileSize;
      let tileBottom = (tileY + 64) * this.tileSize;
      let tileLeft = tileX * this.tileSize;
      let tileRight = (tileX + 64) * this.tileSize;
          //make it so that the player doesnt collide with the boss and enemy tiles
                  if(playerBottom - 16 >= tileTop && this.vy == this.ay && this.canDash == false && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18 ){
        }
          if(currentLevel != 5){
      if (playerBottom - 16 >= tileTop && this.vy == this.ay && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41)&& !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss) && !((map.tiles[y][x] == 42 || map.tiles[y][x] == 43 || map.tiles[y][x] == 44 || map.tiles[y][x] == 45 || map.tiles[y][x] == 46) && currentLevel === 3) &&map.tiles[y][x] != 19 && map.tiles[y][x] != 18 || (currentLevel == 5 && map.tiles[y][x] != 24)){
              this.canJump = true
              this.coyoteCounter = this.coyoteTime;  // Reset on ground
        return false
      }
    
          if (((playerBottom - 16 >= tileTop)||(playerRight + 16>= tileLeft - 16)||(playerLeft <= tileRight)) && this.vy == this.ay && (map.tiles[y][x] === 19 && currentLevel==1)||(map.tiles[y][x] === 20 && currentLevel==2)||(map.tiles[y][x] === 25 && currentLevel==4)||(map.tiles[y][x] === 64 && currentLevel==3)){
              this.takeDamage(this.currentHealth)
        return false
      }
          if(playerRight + 16>= tileLeft - 16 && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) &&!((map.tiles[y][x] == 42 || map.tiles[y][x] == 43 || map.tiles[y][x] == 44 || map.tiles[y][x] == 45 || map.tiles[y][x] == 46) && currentLevel === 3) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18|| (currentLevel == 5 && map.tiles[y][x] != 24) ){
            
            this.vx = 0
            return false
          }   
          if(playerLeft <= tileRight && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) &&!((map.tiles[y][x] == 42 || map.tiles[y][x] == 43 || map.tiles[y][x] == 44 || map.tiles[y][x] == 45 || map.tiles[y][x] == 46) && currentLevel === 3) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18|| (currentLevel == 5 && map.tiles[y][x] != 24)){
            
            this.vx = 0
            return false
          }
        if(playerTop <= tileBottom && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) &&!((map.tiles[y][x] == 42 || map.tiles[y][x] == 43 || map.tiles[y][x] == 44 || map.tiles[y][x] == 45 || map.tiles[y][x] == 46) && currentLevel === 3) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18|| (currentLevel == 5 && map.tiles[y][x] != 24)){
          this.vx = 0
          
        return false; // Collision with the block
      }
          }
          if(currentLevel == 5){
            if (playerBottom - 16 >= tileTop && this.vy == this.ay && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41)&& !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss) && map.tiles[y][x] != 19 && map.tiles[y][x] != 20 && map.tiles[y][x] != 18 && (currentLevel == 5 && map.tiles[y][x] != 24) && map.tiles[y][x] != 30){
              if(map.tiles[y][x] === 29 && currentLevel==5 && !keyIsDown(83)){
                this.y = tileTop -0.1
                this.vy = 0
                this.canJump = true
              this.coyoteCounter = this.coyoteTime;  // Reset on ground
        return false
              }
              if(map.tiles[y][x] === 29 && currentLevel==5&& keyIsDown(83)){
              return true
            }
              this.canJump = true
              this.coyoteCounter = this.coyoteTime;  // Reset on ground
        return false
      }
          if (playerBottom - 16 >= tileTop && this.vy == this.ay && (map.tiles[y][x] === 19 && currentLevel==1)||(map.tiles[y][x] === 20 && currentLevel==2)||(map.tiles[y][x] === 25 && currentLevel==4)){
              this.takeDamage(this.currentHealth)
        return false
      }
          if(playerRight + 16>= tileLeft - 16 && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18&& (currentLevel == 5 && map.tiles[y][x] != 24)&& map.tiles[y][x] != 30){
            if(map.tiles[y][x] === 29 && currentLevel==5&& !keyIsDown(83)){
              this.y = tileTop-0.1
             // this.vy = -0.1
              return false
            }
            if(map.tiles[y][x] === 29 && currentLevel==5&& keyIsDown(83)){
              return true
            }
            this.vx = 0
            return false
          }   
          if(playerLeft <= tileRight && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18&& (currentLevel == 5 && map.tiles[y][x] != 24)&& map.tiles[y][x] != 30){
            if(map.tiles[y][x] === 29 && currentLevel==5&& !keyIsDown(83)){
              this.y = tileTop-0.1
              //this.vy = -0.1
              return false
            }
            if(map.tiles[y][x] === 29 && currentLevel==5&& keyIsDown(83)){
              return true
            }
            this.vx = 0
            return false
          }
        if(playerTop <= tileBottom && !(map.tiles[y][x] === 7||map.tiles[y][x] ===40||map.tiles[y][x] ===41) && !(map.tiles[y][x] instanceof Enemy2 || map.tiles[y][x] instanceof Boss)&& map.tiles[y][x] != 18&& (currentLevel == 5 && map.tiles[y][x] != 24)&& map.tiles[y][x] != 30){
          if(map.tiles[y][x] === 29 && currentLevel==5){
            this.y = tileTop-0.1
            this.vy = 0.2
            return true
          }
          this.vx = 0
          
        return false; // Collision with the block
      }
          }
                if (playerBottom - 16 >= tileTop && this.vy == this.ay && map.tiles[y][x] == 18){
              canSkip = true
      }
          if(playerRight + 16>= tileLeft - 16 && map.tiles[y][x] == 18){
            canSkip = true
          }   
          if(playerLeft <= tileRight && map.tiles[y][x] == 18){
          canSkip = true
          }
        if(playerTop <= tileBottom && map.tiles[y][x] == 18){
         canSkip = true
      }
          if (playerBottom - 16 >= tileTop && this.vy == this.ay && map.tiles[y][x] == 30 && currentLevel == 5){
              canSummon = true
      }
          if(playerRight + 16>= tileLeft - 16 && map.tiles[y][x] == 30 && currentLevel == 5){
            canSummon = true
          }   
          if(playerLeft <= tileRight && map.tiles[y][x] == 30 && currentLevel == 5){
          canSummon = true
          }
        if(playerTop <= tileBottom && map.tiles[y][x] == 30 && currentLevel == 5){
         canSummon = true
      }
    }
      }
    }
     return true; // No collision
  }
   takeDamage(amount) {
    const currentTime = millis();
    // Deduct from shield first
    if (this.armourHitPoints > 0) {
      this.armourHitPoints -= amount;
      if (this.armourHitPoints < 0) {
        // Spill over damage to health
        this.currentHealth += this.armourHitPoints; // armourHitPoints is negative here
        this.armourHitPoints = 0;
      }
    } else {
      this.currentHealth -= amount;
    }
      this.lastDamageTime = currentTime;
      this.currentHealth = Math.max(0, this.currentHealth);
    // prevent health from dropping below 0
      this.lastDamageTime = millis();
      console.log("Player took damage! Current health:", this.currentHealth);
      if (this.currentHealth <= 0) {
         if (!this.isDead) {
            this.isDead = true;
            this.currentDeathFrame = 0; // Reset death frame to start of animation
            this.lastDeathFrameTime = millis(); // Reset death frame timing
            this.isDeathAnimationComplete = false;
        }
        gameOver()
        // Handle player death here (e.g., reset level, show game over screen)
      }
    }
     updateDeathAnimation() {
        if (this.isDead && !this.isDeathAnimationComplete) {
            const currentTime = millis();
            if (currentTime - this.lastDeathFrameTime >= this.deathAnimationSpeed) {
                this.currentDeathFrame++;
                this.lastDeathFrameTime = currentTime;
                if (this.currentDeathFrame >= 13) { // Assuming 13 frames for the death animation
                    this.isDeathAnimationComplete = true; // End of death animation
                    this.currentDeathFrame = 0
                    this.isDead = false
                }
            }
        }
    }
    drawDeathAnimation() {
        if (this.isDead) {
            const frameWidth = 64 // Assuming each frame is equally spaced horizontally
            const frameHeight = 64 // Full height of sprite sheet
            image(death,this.x-26, this.y-96 ,frameWidth, frameHeight,this.currentDeathFrame * frameWidth, 64*5,frameWidth, frameHeight);
        }
    }
  move(map) {
    let newX = this.x + this.vx;
    let newY = this.y + this.vy;
    if (this.isColliding(newX, this.y, currentMap)) {
      this.x = newX;
    }
    if (this.isColliding(this.x, newY, currentMap)) {
      this.y = newY;
      this.isOnGround = false;
      this.canJump = false
    } else {
      this.isOnGround = true;
      this.vy = 0;
    }
      if (this.coyoteCounter > 0) {
      this.coyoteCounter--;  // Decrease if off the ground
    }
    if (gravity) {
      this.vy += this.ay;
   if (keyIsDown(32) && (this.canJump || this.coyoteCounter > 0) && this.isDashing == false) { // Spacebar key is 32
      this.vy = this.jumpVelocity;
      this.canJump = false;  // Reset jump
      this.coyoteCounter = 0;  // Reset coyote time after jump
    }
      if (this.vy < 0 && this.isDashing == false) {
        this.moveCheck('0', currentMap); // Apply gravity (move upwards)
      } else {
        this.moveCheck('4', currentMap); // Apply gravity (move downwards)
      }
    }
    if (keyIsDown(65)) {
      this.direction = 1;
      this.walkingPlaying = true
      if (frameCount % this.animationSpeed === 0) {
        this.frame = (this.frame + 1) % this.maxFrame;
      }
      this.moveCheck('1', currentMap);
    }
    if (keyIsDown(68)) {
      this.direction = 3;
      this.walkingPlaying = true
      if (frameCount % this.animationSpeed === 0) {
        this.frame = (this.frame + 1) % this.maxFrame;
      }
      this.moveCheck('3', currentMap);
    }
    if(!keyIsDown(65) && !keyIsDown(68)){
      this.walkingPlaying = false
      walking.stop()
    }
    if (keyIsDown(82) && canSkip == true){
      goToNextLevel()
      canSkip = false
    }
    if (keyIsDown(49) && this.hasFireballAbility) { // Check for '1' key press
      this.fireFireball();
    }
    this.updateFireballs();
    if (keyIsDown(82) && canSummon == true && bossFightStarted == false){
      bossFightStarted()
      console.log("boss fight start")
      canSummon = false
    }
if (keyIsDown(69)) {
  // Only allow dash if at least 50 cooldown is available
  if (this.currentDashCooldown >= 50 && this.isDashing == false) {
    if(this.direction == 1) {
      this.vx = -2;
    } else if(this.direction == 3) {
      this.vx = 2;
    }
    this.isDashing = true;
    this.dashEndTime = this.dashDuration;
    this.canJump = false;
    this.currentDashCooldown -= 50; // Subtract 50 from cooldown
    this.dashEndTime = millis() + this.dashDuration;
    this.vy = 0;
    this.ay = 0;
  }
}
     if(this.isDashing){
        newX = this.x + this.vx;
       newY = this.y
                setTimeout(() => {
      this.isDashing = false;
                  this.vx = 0
         this.ay = 0.1
    }, this.dashDuration);
     }
   else{

     newY = this.y + this.vy;
}
    setTimeout(() => {
      this.canDash = true;
    }, this.dashCooldown+1000);

    // Check for collision with coin tiles
    let tileX = Math.floor(this.x / this.tileSize);
    let tileY = Math.floor(this.y / this.tileSize);
     if (isNaN(tileX) || isNaN(tileY)) {
    console.error(`Invalid tile position: tileX=${tileX}, tileY=${tileY}`);
    return; // Exit to avoid further errors
  }
    if (map.tiles[tileY] && map.tiles[tileY][tileX] === 7||map.tiles[tileY][tileX] ===40||map.tiles[tileY][tileX]===41) {
      map.tiles[tileY][tileX] = undefined; // Stop drawing the coin
      this.coinsCollected++; // Increase coins collected
    }
    if (map.tiles[tileY] && map.tiles[tileY][tileX] === 65) {
      map.tiles[tileY][tileX] = undefined; // Remove pickaxe from map
      this.hasPickaxe = true; // Set hasPickaxe to true
    }
   if (map.tiles[tileY] && map.tiles[tileY][tileX] === 19){
      this.takeDamage(this.currentHealth); // Apply lethal damage
    }
     this.checkPortalCollision(map);
     this.checkSummonCollision(map);
    if(this.isOnGround && this.walkingPlaying){
      if (!walking.isPlaying()) {
                walking.loop();
        console.log("test1")
            }
            // Adjust playback rate based on speed
            let rateFactor = constrain(this.speed / this.baseSpeed, 0.1, 4.0);
            walking.rate(rateFactor);
    }
  }
checkPortalCollision(map) {
    let tileX = Math.floor(this.x / this.tileSize);
    let tileY = Math.floor(this.y / this.tileSize);
    if (map.tiles[tileY] && map.tiles[tileY][tileX] === 18) { // Assuming 18 is the portal tile
      this.handlePortalCollision();
    }
  }
    handlePortalCollision() {
    if (keyIsDown(81)) { // If 'Q' is pressed
      playerEnteredPortal();
    }
  }
    checkSummonCollision(map) {
    let tileX = Math.floor(this.x / this.tileSize);
    let tileY = Math.floor(this.y / this.tileSize);
    if (map.tiles[tileY] && map.tiles[tileY][tileX] === 30 && currentLevel == 5) { // Assuming 18 is the portal tile
      this.handleSummonCollision();
    }
  }
    handleSummonCollision() {
    if (keyIsDown(81)) { // If 'Q' is pressed
      startBossFight()
    }
  }
  fireFireball() {
    const currentTime = millis();
    if (this.hasFireballAbility && 
        currentTime - this.lastFireballTime > this.fireballCooldown && 
        this.currentDashCooldown >= 30) {
      
      // Subtract 30 from dash cooldown
      this.currentDashCooldown -= 30;
      
      // Calculate direction based on mouse position
      const cameraX = camera.x || 0; // Replace with actual camera X offset
      const cameraY = camera.y || 0;
      const adjustedMouseX = mouseX + cameraX;
      const adjustedMouseY = mouseY + cameraY;
      const angle = atan2(adjustedMouseY - this.y, adjustedMouseX - this.x);
      const speed = 10;
      const vx = cos(angle) * speed;
      const vy = sin(angle) * speed;
      
      this.fireballs.push({
        x: this.x,
        y: this.y - 24,
        vx: vx,
        vy: vy,
        damage: 30
      });
      
      this.lastFireballTime = currentTime;
    }
  }

  updateFireballs() {
    for (let i = this.fireballs.length - 1; i >= 0; i--) {
      const fireball = this.fireballs[i];
      fireball.x += fireball.vx;
      fireball.y += fireball.vy;
      
      // Draw fireball
      image(fire, fireball.x, fireball.y, 32, 32);
      
      // Check for collision with enemies or boss
      if (currentMap.tiles) {
        for (let y = 0; y < currentMap.tiles.length; y++) {
          for (let x = 0; x < currentMap.tiles[y].length; x++) {
            const tile = currentMap.tiles[y][x];
            if (tile instanceof Boss) {
              if (dist(fireball.x, fireball.y, tile.x, tile.y) < 50) {
                tile.takeDamage(fireball.damage);
                this.fireballs.splice(i, 1);
                break;
              }
            }
          }
        }
      }
      
      // Remove off-screen fireballs
      if (fireball.x < this.x - 1000 || fireball.x > this.x + 1000 ||
          fireball.y < this.y - 1000 || fireball.y > this.y + 1000) {
        this.fireballs.splice(i, 1);
      }
    }
  }

  draw() {
    if(((p.y > 802 || (p.y > 128 && p.x < 1024) || p.x >= 2911+674.8) && currentLevel === 3)||(p.y >= 1056 && currentLevel === 2)){
      undergroundMultiplier = 1.5
    }
    else{
      undergroundMultiplier = 1
    }
    if (this.isDead) {
           this.drawDeathAnimation();
            this.updateDeathAnimation();
        }
     let frameX = 0
    let frameY = 0
    if(this.direction == 1 && this.isAttacking){
      frameX = 55-20+(this.attackFrame * 192); // Assuming tileSize is the frame width
      frameY = 37*64
       image(img, this.x-38, this.y-42, 45*1.3,45, frameX, frameY, 64*1.3,64);
    }
    else if(this.direction == 3 && this.isAttacking){
    frameX = 40+(this.attackFrame * 192); // Assuming tileSize is the frame width
    frameY = 43*64; // Assuming single row spritesheet; adjust if more rows
      image(img, this.x-38, this.y-42, 45*1.8,45, frameX, frameY, 64*1.8,64);
    }
        else{
    image(img, this.x-18, this.y-42, 45, 45, this.frame * 64, (this.direction + 8) * 64, 64, 64);
        }
        this.angle = atan2(mouseY - this.y, mouseX + this.x -width/2 - this.x);
    //uodate mouseX to the new transformed position of the mouse
    if (millis() - this.lastDamageTime < this.invincibilityDuration) {
      if (frameCount % 10 < 5) {
        tint(255, 128);
      }
    }
    noTint()
    this.drawDashCooldown()
       if (this.hasGun && mouseIsPressed && mouseButton === LEFT && currentLevel == 5 ){
         //set a timeout for every 0.1 seconds
      this.attemptFireBullet();
    }
    // Update and draw bullets
    this.updateBullets();
            if(this.hasGun == true && currentLevel == 5){
          this.drawGun()
        }
  }
      attemptFireBullet() {
    const currentTime = millis();
    if (currentTime - this.lastFireTime > this.fireCooldown) {
      this.fireBullet();
      this.lastFireTime = currentTime;
    }
  }
     drawGun() {
    // Calculate the position to place the gun image
            const cameraX = camera.x || 0; // Replace with actual camera X offset
    const cameraY = camera.y || 0; // Replace with actual camera Y offset
    // Adjust mouse position based on camera offset
    const adjustedMouseX = mouseX + cameraX;
    const adjustedMouseY = mouseY + cameraY;
    // Calculate the angle using adjusted mouse position
    const angle = atan2(adjustedMouseY - this.y, adjustedMouseX - this.x);
    const scaleFactor = 1/8
    push();
    translate(this.x, this.y-10); // Move to player's location
    rotate(angle); // Rotate to face mouse direction
    // Draw the gun image with its handle at the player's position
    // Adjust the offsets accordingly
    imageMode(CENTER); // Center image at (0,0)
       scale(scaleFactor, angle < -PI / 2 || angle > PI / 2 ? -scaleFactor : scaleFactor);
    image(gun, 32,-24); // Draw the gun at computed position
    pop();
  }
  fireBullet() {
        const currentTime = millis(); // Get current time in milliseconds
          gunSounds.play()
            const speed = 50; // Bullet speed
            const adjustedMouseX = mouseX + (camera.x || 0); // Replace with actual camera X offset
            const adjustedMouseY = mouseY + (camera.y || 0); // Replace with actual camera Y offset
            const angle = atan2(adjustedMouseY - this.y, adjustedMouseX - this.x);
            
            // Add new bullet to the array
            this.bullets.push({
                x: this.x,
                y: this.y - 16,
                vx: speed * cos(angle),
                vy: speed * sin(angle),
                damage: 1
            });
            this.lastFireTime = currentTime; // Update the last fire time
    }
  updateBullets() {
    for (const bullet of this.bullets) {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
 let angle = Math.atan2(bullet.vy, bullet.vx);
    // Draw the rotated bullet image
    push(); // Save the current drawing state
    translate(bullet.x, bullet.y); // Move to bullet position
    rotate(angle); // Rotate according to movement direction
    imageMode(CENTER); // Center the image on the bullet position
    image(bulletShot, 0, 0, 64, 64, 0, 0, 64,64); // Draw the bullet, adjust size as needed
    pop(); // Restore the previous drawing state
      if(this.isOnScreen(bullet)){
        this.isShooting = true
      }
      if(!this.isOnScreen(bullet)){
        this.isShooting = false
      }
    }
    // Optional: Remove off-screen bullets
    this.bullets = this.bullets.filter(bullet => this.isOnScreen(bullet));
  }
  isOnScreen(bullet) {
    return bullet.x >= 900 && bullet.x <= 3800 && bullet.y >= -100 && bullet.y <= 600;
  }
   drawDashCooldown() {
    // Increase cooldown smoothly
    const currentTime = millis();
    if (!this.lastCooldownIncrease) {
      this.lastCooldownIncrease = currentTime;
    }
    
    const deltaTime = (currentTime - this.lastCooldownIncrease) / 1000;
    this.currentDashCooldown = Math.min(100, this.currentDashCooldown + (10 * deltaTime));
    this.lastCooldownIncrease = currentTime;

    // Draw dash cooldown circle
    push();
    const circleX = this.x + window.screen.width/2 - 50;
    const circleY = this.y + window.screen.height/2 - 50;
    const circleSize = 80;
    
    // Draw outer circle (border)
    noFill();
    stroke(0, 0, 100);
    strokeWeight(5);
    ellipse(circleX, circleY, circleSize);
    
    // Draw cooldown fill
    let angle = map(this.currentDashCooldown, 0, 100, 0, 360);
    fill(0, 100, 255);
    noStroke();
    arc(circleX, circleY, circleSize - 5, circleSize - 5, 0, radians(angle), PIE);
    
    // Draw inner circle (black background)
    fill(0);
    ellipse(circleX, circleY, circleSize * 0.7);
    
    // Draw cooldown text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(Math.floor(this.currentDashCooldown), circleX, circleY);

    // Draw the 4 small rectangles
    const rectWidth = 25;
    const rectHeight = 35;
    const rectSpacing = 5;
    const startX = circleX - circleSize/2 - 200;
    
    for(let i = 0; i < 4; i++) {
      fill(40);
      stroke(100);
      strokeWeight(2);
      const rectX = startX + (rectWidth + rectSpacing) * i;
      const rectY = circleY - rectHeight/2;
      rect(rectX, rectY, rectWidth, rectHeight);
      
      // Draw icons based on conditions
      if (i === 0) {
        image(dashIcon, rectX + 2, rectY + 2, rectWidth - 4, rectHeight - 4);
      } else if (i === 1 && this.hasFireballAbility) {
        image(fireballIcon, rectX + 2, rectY + 2, rectWidth - 4, rectHeight - 4);
      }
    }
    
    pop();
  }
  attack() {
    if(!this.hasGun || currentLevel != 5){
    if (mouseIsPressed && !this.attackTimer) {
      attacks++
      this.isAttacking = true;
      this.attackStartTime = millis(); // Start the attack timer
      this.attackTimer = true; // Set the attack cooldown flag
      // Reset all enemies' hit state
      currentMap.tiles.forEach(row => {
        row.forEach(tile => {
          if (tile instanceof Enemy2) {
            tile.hitCooldown = 0;
          }
        });
      });
      setTimeout(() => {
        this.isAttacking = false;
      }, 200); // Attack hitbox stays for 0.5 seconds
      setTimeout(() => {
        this.attackTimer = false;
      }, 350); // Attack cooldown of 1 second
    }
    // Draw the attack hitbox if the attack is ongoing
    if (this.isAttacking) {
      fill(255, 0, 0, 100);
      if (this.direction == 1) {
        this.attacking = true
        this.updateAttackAnimation();
      } else if (this.direction == 3) {
        this.attacking = true
        this.updateAttackAnimation();
      }
    } else {
      this.attacking = false
    }
  }
  }
      updateAttackAnimation() {
    // Check if it's time to update the attack frame
    if (millis() - this.attackAnimationTimer >= this.attackFrameDuration) {
      this.attackFrame++;
      this.attackAnimationTimer = millis();
      // Loop back to the beginning if reached end of the attack animation
      if (this.attackFrame >= this.attackFrameStart + this.attackFrameCount) {
        this.attackFrame = this.attackFrameStart;
      }
    }
  }
  hide(){
  }
}
  class HealthBar {
  constructor() {
    this.x = -50;
    this.y = p.y + 350;
    this.size = 80;
    this.borderWidth = 5;
    this.armourBorderWidth = 10
  }
  draw(currentHealth, maxHealth) {
    if(!bossFightStarted) {
      this.y = p.y + window.screen.height/2 - this.size/2 - 20;
      
      push();
      // Draw outer circle (border)
      noFill();
      stroke(100, 0, 0);
      strokeWeight(this.borderWidth);
      ellipse(p.x-window.screen.width/2 + this.size/2 + 20, this.y, this.size);
      
      // Draw health fill
      let angle = map(currentHealth, 0, maxHealth, 0, 360);
      fill(200, 0, 0);
      noStroke();
      arc(p.x-window.screen.width/2 + this.size/2 + 20, this.y, this.size - this.borderWidth, this.size - this.borderWidth, 0, radians(angle), PIE);
      
      // Draw inner circle (black background)
      fill(0);
      ellipse(p.x-window.screen.width/2 + this.size/2 + 20, this.y, this.size * 0.7);
      
      // Draw health text
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(16);
      text(Math.ceil(currentHealth) + '/' + maxHealth, p.x-window.screen.width/2 + this.size/2 + 20, this.y);
      
      if (p.hasArmour) {
        let armourAngle = map(p.armourHitPoints, 0, p.maxArmourHitPoints, 0, 360);
        const arcCenterX = p.x-window.screen.width/2 + this.size/2 + 20;
        const arcCenterY = this.y;
        const arcSize = this.size + this.armourBorderWidth * 2;
        
        noFill();
        stroke(0, 0, 200);
        strokeWeight(this.armourBorderWidth);
        arc(arcCenterX, arcCenterY, arcSize, arcSize, 0, radians(armourAngle), OPEN);
      }
      
      translate(width/2-p.x,height/2-p.y);
      pop();
    }
        if(bossFightStarted){
    this.y = 655
           if (p.hasArmour) {
    noFill();
      stroke(0, 0, 0); // Blue color for armour
      strokeWeight(this.armourBorderWidth);
      ellipse(1850, this.y, this.size + this.armourBorderWidth); // Draw larger circle
      let armourAngle = map(p.armourHitPoints, 0, p.maxArmourHitPoints, 0, 360);
      fill(0, 0, 200);
      noStroke();
      arc(1850, this.y, this.size + this.armourBorderWidth * 2, this.size + this.armourBorderWidth * 2, 0, radians(armourAngle), PIE);
    }
    push();
    // Draw outer circle (border)
    noFill();
    stroke(100, 0, 0);
    strokeWeight(this.borderWidth);
    ellipse(1850, this.y, this.size);
    // Draw health fill
    let angle = map(currentHealth, 0, maxHealth, 0, 360);
    fill(200, 0, 0);
    noStroke();
    arc(1850, this.y, this.size - this.borderWidth, this.size - this.borderWidth, 0, radians(angle), PIE);
    // Draw inner circle (black background)
    fill(0);
    ellipse(1850, this.y, this.size * 0.7);
    // Draw health text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(Math.ceil(currentHealth) + '/' + maxHealth, 1850, this.y);
    pop();
  }
}
  }
//create a ring around the player. inside the ring is where the player can see and the area around the ring is where the player can't see
class Vision {
  constructor() {
this.radius = 700
  }
  draw() {
    push();
    translate(p.x, p.y);
    // Set styles for the vision circle
        stroke(0,0,0,80);
    strokeWeight(400*undergroundMultiplier);
    fill(255, 255, 255, 0)
        ellipse(0, 0, 700);
        stroke(0,0,0,60);
    strokeWeight(300*undergroundMultiplier);
    fill(255, 255, 255, 0)
        ellipse(0, 0, 700);
        stroke(0,0,0,40);
    strokeWeight(200*undergroundMultiplier);
    fill(255, 255, 255, 0)
        ellipse(0, 0, 700);
        stroke(0,0,0,20);
    strokeWeight(100*undergroundMultiplier);
    fill(255, 255, 255, 0)
        ellipse(0, 0, 700);
    stroke(0,0,0);
    strokeWeight(800*undergroundMultiplier);
    fill(255, 255, 255, 0); // Transparent fill




    // Draw the circle around the player
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }
}
class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoomFactor = 1
  }
  // Follow the player or any given target
  follow(target) {
    this.x = target.x - width / 2;
    this.y = target.y - height / 2;
  }
  // Lock to specific coordinates
  lock(x, y) {
    this.x = x
    this.y = y
  }
  apply() {
    translate(-this.x, -this.y);
    scale(this.zoomFactor)
  }
  zoom(factor){
    this.zoomFactor = (factor)
  }
}
// Create an instance of the Camera class