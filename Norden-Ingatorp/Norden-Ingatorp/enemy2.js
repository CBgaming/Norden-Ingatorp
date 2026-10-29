class Enemy2 {
  constructor(x, y) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.vx = 1.5; // Increased base speed
    this.vy = 0;
    this.ay = 0.5;
    this.tileSize = 32;
    this.width = 32;
    this.height = 32;
    this.enemyHealth = 120; // Increased health
    this.hitCooldown = 0;
    this.alreadyHit = false;
    this.isOnGround = false;
    this.direction = 1;
    this.moveTimer = 0;
    this.spriteSheet = goblinSprite;
    this.currentFrame = 0;
    this.totalFrames = 9;
    this.animationSpeed = 0.1;
    this.dx = 0;
    this.distance = 0;
    this.lastAttackTime = 0;
    this.attackCooldown = 1500; // Reduced cooldown
    this.isAttacking = false;
    this.attackDuration = 500;
    this.attackStartTime = 0;
    this.canJump = true;
    this.jumpCooldown = 3000;
    this.lastJumpTime = 0;
    this.aggroRange = 500; // Range at which enemy becomes aggressive
    this.attackDamage = 15; // Increased damage
    this.behaviorState = 'patrol'; // patrol, chase, attack
    this.patrolDistance = 100;
    this.patrolStartX = x;
  }

  move(map) {
    const currentTime = millis();
    this.dx = p.x - this.x;
    this.distance = Math.sqrt(this.dx * this.dx + (p.y - this.y) * (p.y - this.y));

    // Update behavior state
    if (this.distance > this.aggroRange) {
      this.behaviorState = 'patrol';
    } else if (this.distance <= 60) {
      this.behaviorState = 'attack';
    } else {
      this.behaviorState = 'chase';
    }

    // Handle different behaviors
    switch (this.behaviorState) {
      case 'patrol':
        // Patrol back and forth
        if (Math.abs(this.x - this.patrolStartX) > this.patrolDistance) {
          this.direction *= -1;
        }
        this.x += this.vx * this.direction * 0.5;
        break;

      case 'chase':
        // Chase player with increased speed
        this.direction = Math.sign(this.dx);
        let newX = this.x + this.vx * this.direction * 1.2;
        if (this.canMove(newX, this.y, currentMap)) {
          this.x = newX;
        }
        
        // Jump if player is above and cooldown is ready
        if (p.y < this.y - 50 && this.isOnGround && currentTime - this.lastJumpTime > this.jumpCooldown) {
          // Calculate jump height based on player's vertical distance
          let heightDiff = this.y - p.y;
          // Increase jump velocity for higher jumps when player is higher
          this.vy = heightDiff > 100 ? -12 : -8;
          this.lastJumpTime = currentTime;
        }
        break;

      case 'attack':
        if (currentTime - this.lastAttackTime > this.attackCooldown) {
          this.attack(p);
          this.lastAttackTime = currentTime;
        }
        break;
    }

    // Apply gravity
    this.vy += this.ay;
    let newY = this.y + this.vy;
    if (this.canMove(this.x, newY, currentMap)) {
      this.y = newY;
      this.isOnGround = false;
    } else {
      this.vy = 0;
      this.isOnGround = true;
    }
  }
   attack(p) {
    this.isAttacking = true;
    this.attackStartTime = millis();
    
    // Different attack patterns based on player position
    if (Math.abs(p.y - this.y) > 32) {
      // Jumping attack if player is above/below
      this.vy = p.y < this.y ? -6 : 6;
      p.takeDamage(this.attackDamage * 1.5);
    } else {
      // Normal attack with knockback
      p.takeDamage(this.attackDamage);
      const knockbackDirection = Math.sign(p.x - this.x);
      p.vx += knockbackDirection * 1.5;
      p.vy -= 1;
    }
    
    // Dash toward player during attack
    this.vx *= 1.5;
    
    setTimeout(() => {
      this.isAttacking = false;
      this.vx = 1.5; // Reset speed after attack
    }, this.attackDuration);
  }
  canMove(newX, newY, map) {
    let left = Math.floor(newX / this.tileSize);
    let right = Math.floor((newX + this.width - 1) / this.tileSize);
    let top = Math.floor(newY / this.tileSize);
    let bottom = Math.floor((newY + this.height - 1) / this.tileSize);
    // Check each corner of the enemy
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (map.tiles[y] && map.tiles[y][x] !== undefined) {
          if(map.tiles[y][x] !== 24 || currentLevel !== 5) {
          if(map.tiles[y][x] !== 7 && !(map.tiles[y][x] instanceof Enemy2)){
          return false; // Collision detected
        }
      }
        }
      }
    }
    return true; // No collision
  }
collisions(p) {
    if (p.isAttacking && this.hitCooldown === 0) {
      let hitboxX, hitboxY;
      if (p.direction == 1) {
        hitboxX = p.x - 40;
        hitboxY = p.y;
      } else if (p.direction == 3) {
        hitboxX = p.x + 16;
        hitboxY = p.y;
      }
      
      if (collideRectRect(this.x, this.y, this.width, this.height, hitboxX, hitboxY, 32, 32)) {
        this.enemyHealth -= 20;
        this.hitCooldown = 30; // Set cooldown (assuming 60 FPS, this is half a second)
        console.log("Enemy hit! Health:", this.enemyHealth);
      }
    }
  }
 draw() {
      if (this.enemyHealth > 0) {
      fill(0,0,0)
      rect(this.x-55, this.y-35, 110, 20)
      fill(255, 0, 0)
      rect(this.x-50, this.y-30, this.enemyHealth, 10)
      let frameX = Math.floor(this.currentFrame) * 64;
      let frameY = 0;
      if (this.isAttacking) {
          // Use different animation for attack
        this.vx = 0
          if(this.direction == -1){
            this.totalFrames = 6
          frameY = 50 * 64;
          frameX = Math.floor(this.currentFrame) * 192 + 64;
        }
        if(this.direction == 1){
          this.totalFrames = 6;
          frameY = 56 * 64;
        frameX = Math.floor(this.currentFrame) * 192 + 64;
        }
                            setTimeout(() => {
          this.isAttacking = false;
          console.log("Attack ended");
        }, 660)
      } if(!this.isAttacking){
        this.vx = 1
        // Normal walking animation
        if(this.direction == 1){
          this.totalFrames = 8;
          frameY = 11 * 64;
        frameX = Math.floor(this.currentFrame) * 64 + 64;
        }
        if(this.direction == -1){
          this.totalFrames = 8;
          frameY = 9 * 64;
        frameX = Math.floor(this.currentFrame) * 64 + 64;
        }
      }
      // Draw sprite
        if(this.isAttacking){
      image(this.spriteSheet, this.x - 16, this.y - 29, 64, 64, frameX+Math.sign(this.direction)*12, frameY, 64, 64);
        }// Update animation frame
        if(!this.isAttacking){
          image(this.spriteSheet, this.x - 16, this.y - 29, 64, 64, frameX+Math.sign(this.direction)*12, frameY, 64, 64);
        }
      this.currentFrame = (this.currentFrame + this.animationSpeed) % this.totalFrames;
    }
}

}