/**
 * A fish mover for moving fish through user input
 * @param {Constellation} constellation A constellation to move fish in
 * @constructor
 */
const Mover = function(constellation) {
    this.constellation = constellation;
    this.move = null;
    this.cursor = new Vector2();
};

/**
 * Update the mover
 */
Mover.prototype.update = function() {
    if (this.move)
        this.move.body.updateDrag(this.cursor);
};

/**
 * Render the mover
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor since the last update
 */
Mover.prototype.render = function(renderer, time) {
    if (this.move)
        this.move.body.render(renderer, time);
};

/**
 * Move the cursor
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
Mover.prototype.touchMove = function(x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
};

/**
 * Start a new move
 * @param {Fish} fish The fish that needs to be moved
 */
Mover.prototype.pickUp = function(fish) {
    this.move = fish;
};

/**
 * Release any move
 */
Mover.prototype.release = function() {
    if (this.move) {
        this.move.drop();
        this.constellation.drop(this.move);
        this.move = null;
    }
};