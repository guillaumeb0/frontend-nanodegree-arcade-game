var victory = false;
var collectedStar = 0;

/**
 * Represents information about the map.
 * @constructor
 */
var Map = function(){
    this.tileInfo = {
        w: 101,
        h: 83
    };
    this.mapInfo = {
        w: 505,
        h: 606,
        numRow: 5,
        numCol: 6
    };
};

Map.instance = null;
Map.getInstance = function(){
    if (this.instance === null)
        this.instance = new Map();
    return this.instance;
};
Map.prototype.getCoordinates = function(row, col) {
    if (row === 0)
        return {
            x: col * 101,
            y: row * 133,
            w: 101,
            h: 133
        };
    else if (row === 5)
        return {
            x: col * 101,
            y: 133 + (row-1) * 83,
            w: 101,
            h: 121
        };
    else
        return {
            x: col * 101,
            y: 133 + (row-1) * 83,
            w: 101,
            h: 83
        };
};

/**
 * Represents enemies our player must avoid
 * @constructor
 * @param {int} row - The row on which we want the enemy to appear.
 * @param {int} velocity - The speed at which we want the enemy to move.
 */
var Enemy = function(row, velocity) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var map = Map.getInstance();
    var coordinates = map.getCoordinates(row, 0);
    this.sprite = 'images/enemy-bug.png';

    this.velocity = velocity || 300;    // if velocity isn't define, set a default value
    this.body = {               // Information about the sprite
        w: 69,                 // The width of the "bug" part of the sprite
        h: 67,                  // The height of the "bug" part of the sprite
        spaceTop: 77,           // Space above the "bug" part of the sprite
        spaceBottom: 27,        // Space below the "bug" part of the sprite
        getX: function(){
            return 'toto';
        },
        getLeft: () => { return this.x; },      // Return the "hitbox" left of the sprite
        getRight: () => { return this.x + this.body.w; },       // Return the "hitbox" right of the sprite
        getTop: () => { return this.y + this.body.spaceTop; },      // Return the "hitbox" top of the sprite
        getBottom: () => { return this.y + this.body.spaceTop + this.body.h; }, // Return the "hitbox" bottom of the sprite
    };
    this.w = 101;               // Width of the sprite
    this.initialPos = 0 - this.w;
    this.x = 0;                 // X coordinate of the sprite
    this.y = 0;                 // Y coordinate of the sprite
    this.h = 83;                // Height of the sprite
    this.resetPos(row);
};

Enemy.prototype.resetPos = function(row) {
    var map = Map.getInstance();
    var coordinates = map.getCoordinates(row, 0);
    this.x = this.initialPos;
    this.y = coordinates.y - this.body.spaceTop;
};

Enemy.prototype.isColliding = function() {
    return areColliding(player, this);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var map = Map.getInstance();

    if (this.isColliding())
        player.resetPos();

    if (this.x > map.mapInfo.w)
        this.resetPos((Math.floor((Math.random() * 10)) % 3) + 1);

    this.x = this.x + this.velocity * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(){

    this.sprite = 'images/char-boy.png';

    this.isMouvementEnabled = true;
    this.body = {
        w: 101,
        h: 78,
        spaceTop: 63,
        spaceBottom: 31,
        getLeft: () => { return this.x; },      // Return the "hitbox" left of the sprite
        getRight: () => { return this.x + this.body.w; },       // Return the "hitbox" right of the sprite
        getTop: () => { return this.y + this.body.spaceTop; },      // Return the "hitbox" top of the sprite
        getBottom: () => { return this.y + this.body.spaceTop + this.body.h; } // Return the "hitbox" bottom of the sprite
    };

    this.resetPos();
    this.w = 101;
    this.h = 83;
}

Player.prototype.update = function(dt){

};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // TODO: remove when final push
    //ctx.save();
    //ctx.lineWidth = 5;
    //ctx.strokeStyle = 'red';
    //ctx.strokeRect(this.x, this.y, this.w, this.h);
    //ctx.restore();
};

Player.prototype.resetPos = function() {
    var map = Map.getInstance();
    var coordinates = map.getCoordinates(5, 2);

    this.x = coordinates.x;
    this.y = coordinates.y - this.body.spaceTop;
};

Player.prototype.checkVictory = function() {
    if (this.y < 0)
        return true;
};

Player.prototype.moveLeft = function() {
    var map = Map.getInstance();
    if (this.body.getLeft() - map.tileInfo.w >= 0 )     // Prevent the player to go outside the map
        this.x -= map.tileInfo.w;

    if (this.checkVictory())
        setVictory(true);
};

Player.prototype.moveUp = function() {
    var map = Map.getInstance();
    if (this.body.getTop() - map.tileInfo.h >= 0)       // Prevent the player to go outside the map
        this.y -= Map.getInstance().tileInfo.h;

    if (this.checkVictory())
        setVictory(true);
};

Player.prototype.moveRight = function() {
    var map = Map.getInstance();
    if (this.body.getRight() + map.tileInfo.w <= map.mapInfo.w) // Prevent the player to go outside the map
        this.x += Map.getInstance().tileInfo.w;

    if (this.checkVictory())
        setVictory(true);
};

Player.prototype.moveDown = function() {
    var map = Map.getInstance();
    if (this.body.getBottom() + map.tileInfo.h <= map.mapInfo.h)        // Prevent the player to go outside the map
        this.y += Map.getInstance().tileInfo.h;

    if (this.checkVictory())
        setVictory(true);
};

Player.prototype.enableMouvement = function(bool) {
    this.isMouvementEnabled = bool;
};

Player.prototype.handleInput = function(direction) {
    if (!this.isMouvementEnabled)
        return;

    switch (direction){
        case 'left':
            this.moveLeft();
            break;
        case 'up':
            this.moveUp();
            break;
        case 'right':
            this.moveRight();
            break;
        case 'down':
            this.moveDown();
            break;
    }
};

function Star() {
    var map = Map.getInstance();
    var row = (Math.floor(Math.random() * 10) % 3) + 1;
    var col = (Math.floor(Math.random() * 10) % 5);
    var offsetTop = 60;         // offset needed for having a relevant printing of the sprite

    var coordinates = map.getCoordinates(row, col);
    this.x = coordinates.x;
    this.y = coordinates.y - offsetTop;

    this.body = {
        h: 69,
        w: 100,
        spaceTop: 66,
        spaceBottom: 36,
        getLeft: () =>  { return this.x; },
        getRight: () => { return this.x + this.body.w; },
        getTop: () => { return this.y + this.body.spaceTop; },
        getBottom: () => { return this.y + this.body.spaceTop + this.body.h; }
    };

    this.sprite = 'images/Star.png';
}

Star.prototype.update = function(dt) {
    if (this.isColliding())
        collectStar();
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Star.prototype.isColliding = function() {
    return areColliding(player, this);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies;
var player;
var items;

document.addEventListener('DOMContentLoaded', function () {
    allEnemies = [new Enemy(1), new Enemy(2, 500), new Enemy(3, 400)];
    player = new Player();
    items = [new Star()];
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (e.keyCode in allowedKeys)
        player.handleInput(allowedKeys[e.keyCode]);
});

function printScore() {
    var map = Map.getInstance();

    ctx.fillText('Score: ' + collectedStar, map.mapInfo.w, map.mapInfo.h / 10);
    ctx.strokeText('Score: ' + collectedStar, map.mapInfo.w, map.mapInfo.h / 10);
}

function printVictory() {
    var map = Map.getInstance();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillText('You win !', map.mapInfo.w / 2, map.mapInfo.h / 2);
    ctx.strokeText('You win !', map.mapInfo.w / 2, map.mapInfo.h / 2);
    ctx.restore();
}

function setVictory(bool) {
    if (bool) {
        victory = true;
        player.enableMouvement(false);
        setTimeout(function() {
            setVictory(false);
            player.resetPos();
        }, 3000);
    } else {
        victory = false;
        collectedStar = 0;
        player.enableMouvement(true);
    }
}

function collectStar(star) {
    collectedStar += 1;
    console.log(collectedStar);
    var index = items.indexOf(star);
    items.splice(index, 1);
    items.push(new Star());
};

function areColliding(e1, e2) {
    if
    (
        (
            (e1.body.getLeft() >= e2.body.getLeft() && e1.body.getLeft() <= e2.body.getRight()) ||
            (e1.body.getLeft() <= e2.body.getLeft() && e1.body.getRight() >= e2.body.getRight())
        )
        &&
        (
            (e1.body.getTop() >= e2.body.getTop() && e1.body.getTop() <= e2.body.getBottom()) ||
            (e1.body.getTop() <= e2.body.getTop() && e1.body.getBottom() >= e2.body.getTop())
        )
    )
        return true;

    return false;
}