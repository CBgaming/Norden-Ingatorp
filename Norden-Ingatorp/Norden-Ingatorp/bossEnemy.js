let attackArea = { x: this.x-500, y: this.y - 100, width: 500, height: 200 };
let laserNum
let isAttackingIce = false
let isAttackingGround = false
let bossDistance
let bossFightStarted = false;
let centerAttackTriggered = false
let bossCamera = false
class Boss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 500;
    this.height = 64;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.5;
    this.grounded = false;
    this.enemyHealth = 400
    this.maxEnemyHealth = 1000
    this.hitCooldown = 0;
    this.attackDamage = 10;
    this.attackCooldown = 2000;
    this.lastAttackTime = 0;
    this.attackDuration = 1000;
    this.isAttacking = false;
    this.attackHitbox = { width: 32, height: 64 };
    this.invincibilityDuration = 10;
    this.lastDamageTime = 0;
    this.attackStage = 0; // 0: left, 1: right, 2: left again
    this.spriteSheet = bossSprite;
    this.currentFrame = 0;
    this.totalFrames = 8;
    this.animationSpeed = 0.05;
     this.currentStage = 1;
    this.vulnerable = false;
    this.stageTimer = millis();
    this.attackTimer = millis();
    this.iceAttackTimer = millis()
    this.warningBoxTime = 1000; // 1 second for the warning box
    this.attackStage = 0; // for alternating attacks in stage 2
    this.icePositionX = null;
    this.icePositionY = null;
    this.separateX = null
    this.separateY = null 
    this.cameraLocked = false;
     this.projectiles = [];
    this.spawnInterval = 5000; // Spawn every 5 seconds
    this.lastSpawnTime = 0;
    this.laserWarnings = [];
    this.laserWarnings2 = [];
        this.projectilesStage3 = []
    this.projectilesSpeedStage3 = 2
    this.laserInterval = 500; // Interval for launching lasers
    this.laserDuration = 10000; // Total duration for stage 3 laser attack
    this.lastLaserTime = millis();
    this.laserActive = false;
     this.teleportInterval = 5000; // Teleport every 5 seconds
    this.lastTeleportTime = millis();
    this.notHoming = false
     this.followingBall = { x: x, y: y, size: 50, speed: 1, damageCooldown: 0 }; 
    this.ballDamageAmount = 10;
    this.ballCooldownTime = 500; // 0.5 seconds
      this.specialAttackInterval = 10000; // 10 seconds
    this.lastSpecialAttackTime = millis();
    this.attackChoiceInterval = 2000; // 2 seconds
    this.lastAttackChoiceTime = millis();
    this.currentStage3Attack = null;
    this.followingBallSpawned = false
      this.isFalling = false
    this.projectiles3 = []
      this.followingBalls = []; // Array to store the balls
    this.damageCooldownTime = 500;
     this.lasers = []; // Array to store laser positions for moving lasers
    this.rotatingLasers = []; // Array to store rotating lasers data
     this.jumpImpulse = -10;
    this.ringInterval = 300; // 0.3 seconds
    this.ringCount = 5; // Number of projectile rings to fire
    this.movingLasersActive = false;
    this.rotatingLasersActive = false;
    this.projectilesStage3 = []
    this.projectileSpeedStage3 = 2
     this.lastAttackTime = 0;
    this.attackInterval = 2000;
    this.healthOrbs = [];
    this.orbSpawnChance = 0.1;
    this.cameraZoomedIn = false
    this.attackFrames = 4
     this.arenaCorners = [
      { x: 1850, y: -50 },       // Top-left corner
      { x: 3310, y: -50 },        // Top-right corner
      { x: 1850, y: 550 },       // Bottom-left corner
      { x: 3310, y: 550 } // Bottom-right corner
    ];
      this.currentCornerIndex = 0;
    this.spawnInterval2 = 1000; // Spawn every second
    this.lastSpawnTime2 = millis();
    this.projectiles2 = []
      this.setupCoordinateCapture();
  }
  startDeathAnimation() {
    bossCamera = true
    this.teleportToCenter()
    camera.lock(1800+750,150)
    this.zoomCamera()
    this.deathAnimation()
  }
  deathAnimation(){
    this.isFalling = true;
       this.isJumping = true;
    this.vy = -12; // Initial upward velocity for the jump
    this.timeOfDeath = millis();
  }
   teleportToCenter() {
    this.x = 1800+750
    this.y = 350
    console.log(`Teleported to center: (${this.x}, ${this.y})`);
  }
  zoomCamera() {
    camera.zoom(1.3); // Zoom in by 2x
    this.cameraZoomedIn = true; // Mark camera as zoomed in
  }
   resetCamera() {
    if (this.cameraZoomedIn) {
      camera.zoom(1); // Reset zoom to normal
      this.cameraZoomedIn = false;
      // After zoom reset, if 3 seconds passed, follow the player again
      setTimeout(() => {
        camera.follow(p);
      }, 100);
    }
  }
  // Update method to be called in the main game loop
    handleJumpAndFall() {
    if (this.isJumping) {
      this.vy += this.gravity; // Apply gravity
      this.y += this.vy;
      // Condition to transition the boss to a falling state
      if (this.grounded) {
        this.isJumping = false; // Stop jumping
        this.vy = 5; // Start falling through the map
      }
    }
  }
  
   handleTeleportation() {
     if (bossFightStarted && centerAttackTriggered === false && this.rotatingLasersActive === false){
    if (millis() - this.lastTeleportTime > this.teleportInterval) {
      this.teleportToNextCorner();
      this.lastTeleportTime = millis();
    }
  }
   }
  teleportToNextCorner() {
    // Randomly choose a new corner that is different from the current one
    let newCornerIndex;
    do {
      newCornerIndex = Math.floor(Math.random() * this.arenaCorners.length);
    } while (newCornerIndex === this.currentCornerIndex);
    this.currentCornerIndex = newCornerIndex;
    this.x = this.arenaCorners[this.currentCornerIndex].x;
    this.y = this.arenaCorners[this.currentCornerIndex].y;
    console.log(`Teleported to new corner: ${this.currentCornerIndex}`);
    if(this.x < 2500){
      this.direction = 1
    }
    if(this.x > 2500){
      this.direction = -1
    }
  }
  setupCoordinateCapture() {
    setInterval(() => {
      this.capturePlayerCoordinates();
    }, 500); // every 5000 milliseconds (5 seconds)
  }
  capturePlayerCoordinates() {
    this.separateX = p.x; // Assume player is accessible in this context
    this.separateY = p.y;
    
  }
   checkPlayerRange() {
     if(currentLevel == 5 && bossDefeated == false){
  //    if (p.x >= 2600 && bossFightStarted == false && bossDefeated == false) {
  //     startBossFight();
  //      console.log("bossfightstart working")
  //   }
       if(p.x <= 1750 && bossFightStarted == true){
        this.projectiles = [];
        this.projectiles2 = [];
        this.projectiles3 = [];
        this.lasers = [];
        this.rotatingLasers = [];
        this.laserWarnings = [];
        this.laserWarnings2 = [];
        this.projectilesStage3 = [];
         bossFightStarted = false
         camera.follow(p);
         this.enemyHealth = this.maxEnemyHealth
       }
  }
   }
 move(map) {
    // Apply gravity
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Check for ground collision
    this.grounded = false;
    let tileSize = map.tileSize;
    let tileX = Math.floor(this.x / tileSize);
    let tileY = Math.floor((this.y + this.height) / tileSize);
    if (tileY < map.tiles.length && tileX < map.tiles[0].length) {
      if (map.tiles[tileY][tileX] !== undefined && map.tiles[tileY][tileX] !== 7 && !bossDefeated) {
        // Collision with ground
        this.y = tileY * tileSize - this.height;
        this.vy = 0;
        this.grounded = true;
      }
    }
    // Update attack state

    // Update animation frame
    this.currentFrame = (this.currentFrame + this.animationSpeed) % this.totalFrames;
    // Update hit cooldown
    this.updateHitCooldown();
   }
  
    updateHitCooldown() {
    // Decrement the cooldown if it's greater than zero
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }
  }
  canMove(newX, newY, map) {

    let left = Math.floor(newX / this.tileSize);
    let right = Math.floor((newX + this.width - 1) / this.tileSize);
    let top = Math.floor(newY / this.tileSize);
    let bottom = Math.floor((newY + this.height - 1) / this.tileSize);
    // Check each corner of the enemy
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (map.tiles[y] && map.tiles[y][x] !== undefined && map.tiles[y][x] !== 7 && !(map.tiles[y][x] instanceof Enemy2) && !(map.tiles[y][x] instanceof Boss)) {
          return false; // Collision detected
        }
      }
    }
    return true; // No collision
    }
  

takeDamage(amount) {
  if (bossFightStarted) {
    if (millis() - this.lastDamageTime > this.invincibilityDuration) {
      this.enemyHealth -= amount;
      this.lastDamageTime = millis();
      console.log("Boss hit! Health:", this.enemyHealth);
      // Check if a health orb should spawn
      if (this.enemyHealth <= 0) {
        console.log("Boss defeated!");
        bossDefeated = true;
        bossFightStarted = false;
        this.startDeathAnimation();
      }
    }
  }
}
  collisions(p, map) {
    if (bossFightStarted||bossDefeated){
      if(p.isShooting){
        for (const bullet of p.bullets) {
        if (dist(bullet.x, bullet.y, this.x+40, this.y+50) < 50) {
        this.takeDamage(bullet.damage);
          p.bullets.splice(bullet, 1);
      }
      }
      }
    if (p.isAttacking && this.hitCooldown === 0) {
      let hitboxX = p.direction == 1 ? p.x - 40 : p.x + 16;
      let hitboxY = p.y;
      
      if (collideRectRect(this.x, this.y, this.width, this.height, hitboxX, hitboxY, 32, 32)) {
        this.takeDamage(p.playerDamage);
        this.hitCooldown = 30; // Set a short cooldown to prevent multiple hits in a single attack
      }
    }
    }
    // Check for attack collision with player
   
  }
    updateStage() {
      if (bossFightStarted){
    // Stage management logic
        if(this.enemyHealth > (this.maxEnemyHealth/3)*2){
          this.currentStage = 1
        }
    if (this.enemyHealth <= (this.maxEnemyHealth/3)*2 && this.currentStage === 1) {
      this.currentStage = 2;
    }
        if(this.enemyHealth <= (this.maxEnemyHealth/3) && this.currentStage === 2){
          this.currentStage = 3
      }
  }
    }

  checkCollision(attackArea) {
    return (
      attackArea.x < p.x-8 + p.hitboxWidth &&
      attackArea.x + attackArea.width > p.x-8 &&
      attackArea.y < p.y-32 + p.hitboxHeight+16 &&
      attackArea.y + attackArea.height > p.y-32 &&
      p.x-8 > attackArea.x
    );
  }
 
   spawnProjectiles() {
    const projectileCount = 5;
     const viewWidth = 1500;  // Assume 800 as viewable width
    const viewHeight = 600; // Assume 600 as viewable height
    const spawnPadding = 50;
      for (let i = 0; i < projectileCount; i++) {
        const startX = 1830 + Math.random() * (viewWidth - 2 * spawnPadding) + spawnPadding;
        const startY = Math.random() * (viewHeight - 2 * spawnPadding) + spawnPadding;
       const projectile = {
            x: startX,
            y: startY,
            speed: 0.5,
            spawnTime: millis(),
        }
        this.projectiles.push(projectile);
    }
    this.lastSpawnTime = millis();
}
  // Function to update projectiles

    updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      // Calculate velocity; continue in the same direction if not homing anymore
      const elapsedTime = millis() - projectile.spawnTime;
      if (!projectile.notHoming && elapsedTime > 5000) {
        // Stop homing logic
        projectile.notHoming = true;
      }
      if (projectile.notHoming) {
        // Continue in the same velocity direction
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
      } else {
        // Update homing velocity
        let dx = p.x - projectile.x;
        let dy = p.y - projectile.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        projectile.vx = (dx / magnitude) * projectile.speed;
        projectile.vy = (dy / magnitude) * projectile.speed;
        
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
      }
      if(projectile.speed <= 2){
      projectile.speed += 0.01;
      }
      // Draw and check for off-screen or collision
      if (this.isOffScreen(projectile) || this.checkProjectileCollision(projectile, p)) {
        if (this.checkProjectileCollision(projectile, p)) {
          p.takeDamage(5);
        }
        this.projectiles.splice(i, 1);
      }
    }
  }

isOffScreen(projectile) {
  const buffer = 10; // Optional buffer for despawning slightly off-screen
  return (
    projectile.x < 1860 || projectile.x > 3330 ||
    projectile.y < -100 || projectile.y > 600
  );
}
checkProjectileCollision(projectile, p) {
  // Perform collision detection between the projectile and the player
  return (
    projectile.x < p.x + p.hitboxWidth &&
    projectile.x + 16 > p.x && // Assuming projectile width is 32
    projectile.y < p.y-32 + p.hitboxHeight+16 &&
    projectile.y + 16 > p.y-32 && // Assuming projectile height is 32
    p.x > projectile.x
  );
}
    fireProjectile() {
    const projectileSpeed = 3; // Set a constant speed for non-homing projectiles
    // Calculate direction towards player's initial position (non-homing)
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    let magnitude = Math.sqrt(dx * dx + dy * dy);
    let vx = (dx / magnitude) * projectileSpeed;
    let vy = (dy / magnitude) * projectileSpeed;
    // Push the projectile to the array
    this.projectiles2.push({ x: this.x, y: this.y, vx, vy });
  }
updateProjectiles2() {
    for (let i = this.projectiles2.length - 1; i >= 0; i--) {
      let proj = this.projectiles2[i];
      // Move the projectile
      proj.x += proj.vx;
      proj.y += proj.vy;
      // Draw the projectile
      image(fire, proj.x, proj.y, 32, 32);
      // Check collision with player
      if (this.checkProjectileCollision2(proj, p)) {
        p.takeDamage(10); // Deal 10 damage on collision
        this.projectiles2.splice(i, 1); // Remove projectile on hit
      }
    }
  }
  checkProjectileCollision2(proj, p) {
    return (
      proj.x < p.x + p.hitboxWidth &&
    proj.x + 16 > p.x && // Assuming projectile width is 32
    proj.y < p.y-32 + p.hitboxHeight+16 &&
    proj.y + 16 > p.y-32 && // Assuming projectile height is 32
    p.x > proj.x
    );
  }

  warnAttackArea(x, y, width, height) {
    fill(255, 0, 0, 150); // Semi-transparent red
    rect(x, y, width, height);
  }
 triggerStage1Actions(p) {
    if (bossFightStarted){
      let currentTime = millis();
      const currentTime2 = millis();
      if (currentTime - this.lastSpawnTime2 > this.spawnInterval2) {
        this.isAttacking = true
        this.animationSpeed = 0.1;
        // increase sound volume
        projectileShot.play()
        this.fireProjectile(p);
        this.lastSpawnTime2 = currentTime;
         setTimeout(() => {
           this.isAttacking = false
         }, 500)
      }
        if (millis() - this.lastSpawnTime > this.spawnInterval) {
      this.spawnProjectiles();
      }
         if (currentTime2 - this.attackTimer > 10000) { // 10 seconds interval for the attack
        const attackChoice = 1
        switch (attackChoice){
          case 1:
            console.log("Attack 1 triggered");
            homingShot.play()
          this.launchRandomProjectileAttack();
        this.attackTimer = currentTime2;
        break
        }
  }
      this.updateProjectiles();
      this.updateProjectiles2()
      this.updateStage3Projectiles(p);
   }
  }
 // triggerStage2Actions(p) {
 //    const currentTime = millis();
 //    if (currentTime - this.lastAttackTime > this.attackInterval) {
 //      const attackChoice = Math.floor(Math.random() * 4);
 //      switch (attackChoice) {
 //        case 0:
 //          console.log("Attack 1 triggered");
 //          this.triggerRotatingLasers(p);
 //          break;
 //        case 1:
 //          console.log("Attack 2 triggered");
 //          this.triggerMovingLasers(p);
 //          break;
 //        case 2:
 //          console.log("Attack 3 triggered");
 //          this.triggerLaserWarning(p);
 //          break;
 //      }
      
 //      this.lastAttackTime = currentTime;
 //    }

 //     if (!this.laserActive && currentTime - this.lastLaserTime > this.laserInterval) {
 //        this.spawnLaserWarning2(p);
 //        this.lastLaserTime = currentTime;
 //        // Reset attack after duration
 //        if (currentTime - this.lastLaserTime > this.laserDuration) {
 //          this.laserActive = false;
 //          this.laserWarnings2 = []; // Clear warnings after attack
 //        }
 //      }
 //        this.updateLaserWarnings2(p);
 //       this.updateLaserWarnings(p);
 //  }
     triggerStage2Actions(p) {
     if (bossFightStarted) {
         const currentTime = millis();
        if (!this.laserActive && currentTime - this.lastLaserTime > this.laserInterval) {
          this.isAttacking = true
        this.spawnLaserWarning2(p);
          setTimeout(() => {
        this.isAttacking = false;
      }, 300);
        this.lastLaserTime = currentTime;  
        // Reset attack after duration
        if (currentTime - this.lastLaserTime > this.laserDuration) {
          this.laserActive = false;
          this.laserWarnings2 = []; // Clear warnings after attack
        }
      }
if(this.currentStage == 2){
    if (millis() - this.attackTimer > 10000) { // 10 seconds interval for the attack
       const attackChoice = Math.floor(Math.random() * 3 + 1);
      switch (attackChoice) {
        case 1:
          console.log("Attack 1 triggered");
          this.isAttacking2 = true
          rotatingLaser.play()
          this.triggerRotatingLasers(p);
          setTimeout(() => {
        this.isAttacking2 = false;
      }, 6000);
          break;
        case 2:
          rotatingLaser.play()
          console.log("Attack 2 triggered");
          this.isAttacking2 = true
          this.triggerMovingLasers(p);
           setTimeout(() => {
        this.isAttacking2 = false;
      }, 200);
          break;
        case 3:
          console.log("Attack 3 triggered");
          this.isAttacking2 = true
          this.triggerLaserWarning(p);
           setTimeout(() => {
        this.isAttacking2 = false;
      }, 200);
          break;
      }
      this.attackTimer = millis();
    }
        this.updateLaserWarnings2(p);
       this.updateLaserWarnings(p);
  this.updateProjectiles();
      this.updateProjectiles2()
      this.updateStage3Projectiles(p);
  }
     }
       if(this.currentStage == 3){
             if (millis() - this.attackTimer > 10000) { // 10 seconds interval for the attack
       const attackChoice = Math.floor(Math.random() * 2 + 1);
      switch (attackChoice) {
        case 1:
          console.log("Attack 1 triggered");
          this.isAttacking2 = true
          rotatingLaser.play()
          this.triggerRotatingLasers(p);
          setTimeout(() => {
        this.isAttacking2 = false;
      }, 6000);
          break;
        case 2:
          console.log("Attack 3 triggered");
          this.isAttacking2 = true
          this.triggerLaserWarning(p);
           setTimeout(() => {
        this.isAttacking2 = false;
      }, 4000);
          break;
      }
      this.attackTimer = millis();
    }
        this.updateLaserWarnings2(p);
       this.updateLaserWarnings(p);
  }
     }
  triggerStage3Actions(p){
    if(bossFightStarted){
        const currentTime = millis();
    // Handle switching between stage 1, 2, and 3 attacks
    if (currentTime - this.lastAttackChoiceTime > this.attackChoiceInterval) {
      this.currentStage3Attack = Math.floor(Math.random() * 2) + 1; // Randomly choose between 1, 2, or 3
      this.lastAttackChoiceTime = currentTime;
    }
    // Execute the chosen attack
    switch(this.currentStage3Attack) {
      case 1:
        this.triggerStage1Actions(p);
        break;
      case 2:
        this.triggerStage2Actions(p);
        break;
    }
    
    // Special centered attack every 10 seconds
    if (currentTime - this.lastSpecialAttackTime > this.specialAttackInterval) {
      this.isAttacking2 = true
      this.performCenterAttack();
       setTimeout(() => {
        this.isAttacking2 = false;
      }, 2000);
      console.log("Center attack triggered!");
      centerAttackTriggered = true;
      this.lastSpecialAttackTime = currentTime;
    }
  }
            this.updateProjectiles();
          this.updateProjectiles2()
            this.updateLaserWarnings2(p);
       this.updateLaserWarnings(p);
    this.updateStage3Projectiles()
    this.updateProjectiles3()
  }
   launchRandomProjectileAttack() {
    const projectileCount = 10;
    const topBoundary = -100;
    const bottomBoundary = 610; // Just beyond the screen's bottom
    const leftBoundary = 1800
    const rightBoundary = 3350
    // Launch projectiles from the left side
    for (let i = 0; i < projectileCount; i++) {
      const startY = Math.random() * (bottomBoundary - topBoundary) + topBoundary;
      this.projectilesStage3.push({ x: 1800, y: startY, vx: this.projectileSpeedStage3, vy: 0 });
    }
    // Launch projectiles from the right side
    for (let i = 0; i < projectileCount; i++) {
      const startY = Math.random() * (bottomBoundary - topBoundary) + topBoundary;
      this.projectilesStage3.push({ x: 3350, y: startY, vx: -this.projectileSpeedStage3, vy: 0 });
    }
     for (let i = 0; i < projectileCount; i++) {
      const startX = Math.random() * (rightBoundary - leftBoundary) + leftBoundary;
      this.projectilesStage3.push({ x: startX, y: 1075, vx: 0, vy: -this.projectileSpeedStage3});
    }
    // Launch projectiles from the right side
    for (let i = 0; i < projectileCount; i++) {
      const startX = Math.random() * (rightBoundary - leftBoundary) + leftBoundary;
      this.projectilesStage3.push({ x: startX, y: -475, vx: 0, vy: this.projectileSpeedStage3 });
    }
  }
  updateStage3Projectiles() {
    for (let i = this.projectilesStage3.length - 1; i >= 0; i--) {
      const projectile = this.projectilesStage3[i];
      // Move the projectile
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;
      // Draw the projectile
      // Check for player collision
      if (this.checkProjectileCollision(projectile, p)) {
        p.takeDamage(5); // Deal 5 damage on collision
        this.projectilesStage3.splice(i, 1); // Remove projectile on collision
      }
      // Remove off-screen projectiles
      if (projectile.x < 1800 || projectile.x > 3350 || projectile.y < -500 || projectile.y >1100) {
        this.projectilesStage3.splice(i, 1);
      }
    }
  }
  checkProjectileCollision(projectile, p) {
    // Perform collision detection between the projectile and the player
    return (
      projectile.x < p.x + p.hitboxWidth &&
      projectile.x + 16 > p.x && // Assuming projectile width is 16
      projectile.y < p.y-32 + p.hitboxHeight+16 &&
      projectile.y + 16 > p.y-32 // Assuming projectile height is 16
    );
  }
   performCenterAttack() {
    // Teleport to the center of the arena
    this.x = 3360-750
    this.y = 350
    // Define function to create a single ring of projectiles
   const rotationOffset = 5
  // Define function to create a single ring of projectiles with a rotational offset
  const fireRing = (delay, rotationOffset) => {
    setTimeout(() => {
      const projectileCount = 16; // Number of projectiles per ring
      for (let i = 0; i < projectileCount; i++) {
        // Add the rotation offset for the current ring
        const angle = (TWO_PI / projectileCount) * i + (rotationOffset*i) ;
        const speed = 3; // Speed of projectiles
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        this.projectiles3.push({
          x: this.x,
          y: this.y,
          vx: dx,
          vy: dy,
          spawnTime: millis(),
        });
      }
    }, this.ringInterval * delay);
  };
  // Fire multiple rings of projectiles with increasing rotation offsets
  for (let i = 0; i < this.ringCount; i++) {
    // Rotate each subsequent ring by `rotationOffset * i`
    fireRing(i, rotationOffset * i);
  }
  // Set a timeout to reset any attack-specific flags or states if needed
  setTimeout(() => {
    centerAttackTriggered = false;
  }, this.ringInterval * (this.ringCount + 1));
}
  updateProjectiles3() {
    for (let i = this.projectiles3.length - 1; i >= 0; i--) {
      const projectile3 = this.projectiles3[i];
      
      // Move the projectile
      projectile3.x += projectile3.vx;
      projectile3.y += projectile3.vy;
      
      // Check for off-screen and damage player
      if (this.isOffScreen(projectile3)) {
        this.projectiles3.splice(i, 1);
      } else {
        // Draw and check collision
        image(fire, projectile3.x, projectile3.y, 16, 16);
        if (this.checkProjectileCollision(projectile3, p)) {
          p.takeDamage(5);
          this.projectiles3.splice(i, 1);
        }
      }
    }
  }
  isOffScreen(projectile3) {
    return (
      projectile3.x < 1860 || projectile3.x > 3330 ||
      projectile3.y < -100 || projectile3.y > 600
    );
  }
  
  // Call this method when the stage changes
    triggerMovingLasers() {
    if (this.laserWarnings.length > 0) return;
    console.log("Moving lasers triggered!");
    this.movingLasersActive = true;
    const moveDirection = 'horizontal';
    const laserSpeed = 4;
    const centerOffset = 100;
    let laser1 = { x: 0, y: 0 };
    let laser2 = { x: 0, y: 0 };
    if (moveDirection === 'horizontal') { 
        laser1 = { startX: 1800, startY: -100, endX: 1800, endY: 600 };
        laser2 = { startX: 3350, startY: -100, endX: 3350, endY: 600 };
    }
    this.lasers = [laser1, laser2];
    const interval = setInterval(() => {
      this.lasers.forEach(laser => {
        if(moveDirection === 'horizontal') {
          laser1.startX += laserSpeed;
          laser1.endX += laserSpeed;
          laser2.startX -= laserSpeed;
          laser2.endX -= laserSpeed;
          if (Math.abs(laser2.startX - laser1.startX) <= 100 + centerOffset) {
            clearInterval(interval);
            this.movingLasersActive = false;
          }
        }
        // Draw and check collisions
        if (this.checkLaser3Collision(laser, p)) {
          p.takeDamage(10);
        }
      });
    }, 50);
      setTimeout(() => {
      this.movingLasersActive = false;
        this.lasers = [];
    }, 6000)
  }
   triggerRotatingLasers() {
    if (this.laserWarnings.length > 0) return;
       this.x = 3360-775
       this.y = 295; // Arbitrary center Y position
    this.rotatingLasersActive = true;
    const laserCount = 5;
    let angle = 0;
    let angleIncrement = 0.005;
    const radius = 1000;
    this.rotatingLasers = Array.from({ length: laserCount }, (_, i) => ({
      angle: angle + (i * TWO_PI / laserCount)
    }));
    const interval = setInterval(() => {
      angle += angleIncrement;
      angleIncrement += 0.00025;
      this.rotatingLasers.forEach((laser, i) => {
        const laserAngle = angle + (i * TWO_PI / laserCount);
        const startX = 2592;
        const startY = 325;
        const endX = this.x + Math.cos(laserAngle) * radius;
        const endY = this.y + Math.sin(laserAngle) * radius;
        laser.startX = startX;
        laser.startY = startY;
        laser.endX = endX;
        laser.endY = endY;
        if (this.checkLaser3Collision(laser, p)) {
          p.takeDamage(5);
        }
      });
      if (!this.rotatingLasersActive) {
        clearInterval(interval);
      }
    }, 50);
     setTimeout(() => {
    clearInterval(interval);
    this.rotatingLasersActive = false;
    this.rotatingLasers = [];
  }, 6000); // Attack duration of 6 seconds
  }
  checkLaser3Collision(laser, p) {
    return collideLineRect(
      laser.startX, laser.startY,
      laser.endX, laser.endY,
      p.x - 8, p.y - 32,
      p.hitboxWidth, p.hitboxHeight + 16
    );
  }

// Update the triggerStage2Actions function with the new attack phases

triggerLaserWarning() {
  this.laserWarnings = [];
  const screenDiagonal = Math.sqrt(width * width + height * height);
  for (let i = 0; i < 20; i++) {
    // Generate a random center position for laser warnings within the arena
    let centerX = random(1830, 3360);
    let centerY = random(0, 800);
    let angle = random(0, TWO_PI);
    
    // Calculate start and end points based on the random angle
    let startX = centerX + screenDiagonal * cos(angle);
    let startY = centerY + screenDiagonal * sin(angle);
    let endX = centerX - screenDiagonal * cos(angle);
    let endY = centerY - screenDiagonal * sin(angle);
    
    // Store the details of each warning line and start timer
    this.laserWarnings.push({ startX, startY, endX, endY, timer: millis() });
  }
  // After a 2-second delay, trigger the laser attack
  setTimeout(() => {
    massLasers.play()
    this.spawnLasers();
  }, 2000); // Wait 2 seconds before the laser attack
}
spawnLasers() {
  this.laserWarnings.forEach(warning => {
    const laserWidth = dist(warning.startX, warning.startY, warning.endX, warning.endY);
    const angle = atan2(warning.endY - warning.startY, warning.endX - warning.startX);
    // Drawing the laser sprite instead of a line
    push();
    translate(warning.startX, warning.startY);
    rotate(angle);
    image(laser, 0, 0, laserWidth, 16); // Draw laser using laser image
    pop(); 
    // Check collision with player
    if (this.checkLaserCollision(warning.startX, warning.startY, warning.endX, warning.endY, p)) {
      p.takeDamage(10);
    }
  });
  // Clear the warning effects and lasers after 0.5 seconds
  setTimeout(() => {
    this.laserWarnings = [];
  }, 500);
}
updateLaserWarnings() {
  for (let i = this.laserWarnings.length - 1; i >= 0; i--) {
    const warning = this.laserWarnings[i];
    const elapsedTime = millis() - warning.timer;
     const laserWidth = dist(warning.startX, warning.startY, warning.endX, warning.endY);
    const angle = atan2(warning.endY - warning.startY, warning.endX - warning.startX);
    // Draw warning as a semi-transparent line
    stroke(255, 0, 0, 150); // Red color for warning
    strokeWeight(2);
    line(warning.startX, warning.startY, warning.endX, warning.endY);
    // Remove warning after 2 seconds (to match the laser spawn delay)
    if (elapsedTime > 2000) {
       push();
    translate(warning.startX, warning.startY);
    rotate(angle);
    image(laser, 0, 0, laserWidth, 16); // Draw laser using laser image
    pop(); 
    }
  }
}
  checkLaserCollision(startX, startY, endX, endY, p) {
  // Use the collide2d library to check if the line intersects with the rectangle
  return collideLineRect(
    startX, startY,          // Line start point
    endX, endY,              // Line end point
    p.x-8, p.y-32,                // Rectangle top-left corner
    p.hitboxWidth, p.hitboxHeight+16        // Rectangle dimensions
  );
}
  spawnLaserWarning2() {
    const screenDiagonal = Math.sqrt(width * width + height * height);
    const angle = random(0, TWO_PI); // Random vertical rotation
    // Center laser on the player's x position with random y rotation
    const startX = p.x + screenDiagonal * cos(angle);
    const startY = p.y + screenDiagonal * sin(angle);
    const endX = p.x - screenDiagonal * cos(angle);
    const endY = p.y - screenDiagonal * sin(angle);
    // Add warning to array
    this.laserWarnings2.push({ startX, startY, endX, endY, timer: millis() });
    // Set timeout to activate laser damage
    setTimeout(() => {
      laserShot.play()
      if (this.checkLaserCollision2(startX, startY, endX, endY, p)) {
        p.takeDamage(10); // Deal 10 damage on laser collision
      }
    }, 1000); // Laser becomes active after 0.5 seconds
  }
  updateLaserWarnings2() {
    for (let i = this.laserWarnings2.length - 1; i >= 0; i--) {
      const warning = this.laserWarnings2[i];
      const elapsedTime = millis() - warning.timer;
      // Draw warning as a semi-transparent line
      stroke(255, 0, 0, 100);
      strokeWeight(2);
      const laserWidth = dist(warning.startX, warning.startY, warning.endX, warning.endY);
    const angle = atan2(warning.endY - warning.startY, warning.endX - warning.startX);
      line(warning.startX, warning.startY, warning.endX, warning.endY);
      
      // Remove laser warning after damage period
      if (elapsedTime > 1000) {
            push();
    translate(warning.startX, warning.startY);
    rotate(angle);
    image(laser, 0, 0, laserWidth, 16); // Draw laser using laser image
    pop();
        this.laserWarnings2.splice(i, 1);
      }
    }
  }
  checkLaserCollision2(startX, startY, endX, endY, p) {
    // Use the collide2d library to check line collision with player rectangle
    return collideLineRect(
      startX, startY,               // Line start
      endX, endY,                   // Line end
      p.x - 8, p.y - 32,            // Player position
      p.hitboxWidth, p.hitboxHeight + 16 // Player hitbox size
    );
  }
  draw() {
    this.checkPlayerRange(p);
    if (bossFightStarted||bossDefeated){
    if (this.enemyHealth > 0||bossDefeated) {
      let frameX = 0
      let frameY = 0
      if(this.isAttacking2){
        this.totalFrames = 6
        frameX = Math.floor(this.currentFrame) * 64 + 64
        frameY = 2*64
        image(this.spriteSheet, this.x-48, this.y-22, 74*1.44, 70*1.44, frameX-6, frameY, 74, 70)
      }
      if(this.isAttacking && !this.isAttacking2 && this.direction == -1){
        frameX = Math.floor(this.currentFrame) * 192 + 64 + 64*6;
        frameY = 50*64
        image(this.spriteSheet, this.x-48, this.y-22, 100*1.44, 88*1.44, frameX-24, frameY, 100, 88)
      }
      if(this.isAttacking && !this.isAttacking2 && this.direction == 1){
        frameX = Math.floor(this.currentFrame) * 192 + 64 + 64*6;
        frameY = 56*64
        image(this.spriteSheet, this.x-48, this.y-22, 100*1.44, 88*1.44, frameX-24, frameY, 100, 88)
      }
      if(!this.isAttacking && !this.isAttacking2){
        this.currentFrame = 0;
      }
      if(!this.isAttacking2){
        this.totalFrames = 8
      }
      if(!this.isAttacking && !this.isAttacking2 && this.direction == -1){
        frameX = 0
        frameY = (9*64)
        image(this.spriteSheet, this.x-48, this.y-22, 100*1.44, 77*1.44, frameX-24, frameY, 100, 77)
      }
      if(!this.isAttacking && !this.isAttacking2 && this.direction == 1){
        frameX = 0
        frameY = (11*64)
        image(this.spriteSheet, this.x-48, this.y-22, 100*1.44, 77*1.44, frameX-24, frameY, 100, 77)
      }


      
      this.handleJumpAndFall();
      if(this.enemyHealth >=0){
       this.updateStage();
    if (this.currentStage === 1) {
      this.triggerStage1Actions(p);
    } 
    if (this.currentStage === 2){
      this.triggerStage2Actions();
    }
    if (this.currentStage === 3){
      this.triggerStage3Actions();
    }
         for (const projectile of this.projectiles) {
      image(fire, projectile.x, projectile.y, 16, 16);
    }
      for (const proj of this.projectiles2) {
      image(fire, proj.x, proj.y, 32, 32);
    }
      for (const projectile3 of this.projectiles3) {
      image(fire, projectile3.x, projectile3.y, 32, 32);
    }
      for (let warning of this.laserWarnings) {
    fill(255, 0, 0, 150); // Semi-transparent red for warning
    rect(warning.x, warning.y, warning.width, warning.height);
  }
      for (let laser of this.lasers){
        stroke(255, 0, 0); 
        strokeWeight(5);
        line(laser.startX, laser.startY, laser.endX, laser.endY);
      }
      for (let laser of this.rotatingLasers){
        stroke(255, 0, 0); 
        strokeWeight(5);
        line(laser.startX, laser.startY, laser.endX, laser.endY);
      }
        for(let projectile of this.projectilesStage3){
          image(fire, projectile.x, projectile.y, 16, 16);
        }
        for(let ball of this.followingBalls){
          image(fire, ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);
          circle(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size)
        }
        
      if(isAttackingLaser){
        console.log("laser working")
        fill(255,0,0,100)
        if(laserNum == 1){
      rect(this.x-500, this.y - 150, 500, 100);
        }
        if(laserNum == 2){
          rect(this.x-500, this.y - 50, 500, 100);
        }
    }
  // Draw warning lines
      stroke(255, 0, 0, 150); // Set color for warning lines
      strokeWeight(5);
      for (let warning of this.laserWarnings) {
        // Draw each line based on the stored start and end points
        line(warning.startX, warning.startY, warning.endX, warning.endY);
      }
      // Draw health bar
        if(!bossDefeated){
      fill(0,0,0)
      stroke(1);
      strokeWeight(2);
      rect(((3360+1830)/2)-(this.width/2), 0, this.width, 30)
      noStroke()
      fill(255, 0, 0);
      rect(((3360+1830)/2)-(this.width/2), 0,this.enemyHealth/2, 30);
          fill(0,0,0)
      rect(((3360+1830)/2)-(this.width/2) + (500/3), 0,5, 30)
      rect(((3360+1830)/2)-(this.width/2) + (500/3*2), 0,5, 30)
        }
    }
      if(!(millis() - this.timeOfDeath >= 3000)){
      // Update animation frame
      this.currentFrame = (this.currentFrame + this.animationSpeed) % this.totalFrames;
      // Draw attack hitbox
    }
      if(millis() - this.timeOfDeath >= 3000){
        //clear attack arrays
        this.projectiles = [];
        this.projectiles2 = [];
        this.projectiles3 = [];
        this.lasers = [];
        this.rotatingLasers = [];
        this.laserWarnings = [];
        this.laserWarnings2 = [];
        this.projectilesStage3 = [];
        bossCamera = false
        this.resetCamera()
      }
  }
  }
  }
}