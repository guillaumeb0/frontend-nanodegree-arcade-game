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
 */
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var map = Map.getInstance();
    var coordinates = map.getCoordinates(row, 0);
    this.sprite = 'images/enemy-bug.png';
    this.body = {               // Information about the sprite
        w: 101,                 // The width of the "bug" part of the sprite
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
    this.x = 0;                 // X coordinate of the sprite
    this.y = coordinates.y - this.body.spaceTop;    // Y coordinate of the sprite
    this.w = 101;               // Width of the sprite
    this.h = 83;                // Height of the sprite
    this.velocity = 5;
};

Enemy.prototype.getHitBox = function() {
    var left = this.x;
    var right = this.x + this.w;
    var top = this.y + this.body.spaceTop;
    var bottom = this.y + this.h - this.body.bottom;

    return {
        left: left,
        right: right,
        top: top,
        bottom: bottom
    };
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(){
    var map = Map.getInstance();
    var coordinates = map.getCoordinates(5, 2);
    this.sprite = 'images/char-boy.png';

    this.body = {
        w: 101,
        h: 78,
        topSpace: 63,
        bottomSpace: 31
    };

    this.x = coordinates.x;
    this.y = coordinates.y - this.body.topSpace;
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies;
var player;

document.addEventListener('DOMContentLoaded', function () {
    allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
    player = new Player();
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

    player.handleInput(allowedKeys[e.keyCode]);
});
