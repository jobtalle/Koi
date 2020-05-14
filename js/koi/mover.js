/**
 * A fish mover for moving fish through user input
 * @param {Constellation} constellation A constellation to move fish in
 * @constructor
 */
const Mover = function(constellation) {
    this.constellation = constellation;
    this.move = null;
    this.cursor = new Vector2();
    this.cursorPrevious = new Vector2();
    this.offset = new Vector2();
    this.cursorOffset = new Vector2();
};

Mover.prototype.SPLASH_DROP_RADIUS = 0.1;
Mover.prototype.SPLASH_DROP_AMPLITUDE = 0.4;
Mover.prototype.SPLASH_DROP_DISTANCE = 0.1;

/**
 * Update the mover
 */
Mover.prototype.update = function() {
    if (this.move)
        this.move.body.update(
            this.move.position,
            this.move.direction,
            this.move.speed);
};

/**
 * Render the mover
 * @param {Bodies} bodies The bodies renderer
 * @param {Atlas} atlas The atlas containing the fish textures
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The render scale
 * @param {Number} time The interpolation factor since the last update
 */
Mover.prototype.render = function(
    bodies,
    atlas,
    width,
    height,
    scale,
    time) {
    if (this.move) {
        this.move.render(bodies, time);

        bodies.render(atlas, width, height, scale);
    }
};

/**
 * Move the cursor
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
Mover.prototype.touchMove = function(x, y) {
    this.cursorPrevious.set(this.cursor);
    this.cursor.x = x;
    this.cursor.y = y;

    if (this.move) {
        this.cursorOffset.set(this.cursor).add(this.offset);
        this.move.moveTo(this.cursorOffset);
    }
};

/**
 * Create a fish body shaped splash
 * @param {Body} body A fish body
 * @param {WaterPlane} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.createBodySplash = function(body, waterPlane, random) {
    for (let segment = body.spine.length; segment-- > 0;) {
        const angle = Math.PI * 2 * random.getFloat();
        const intensity = body.pattern.shapeBody.sample(segment / (body.spine.length - 1));
        const distance = this.SPLASH_DROP_DISTANCE * intensity;

        waterPlane.addFlare(
            body.spine[segment].x + Math.cos(angle) * distance,
            body.spine[segment].y + Math.sin(angle) * distance,
            this.SPLASH_DROP_RADIUS * intensity,
            this.SPLASH_DROP_AMPLITUDE * intensity);
    }
};

/**
 * Start a new move
 * @param {Fish} fish The fish that needs to be moved
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 * @param {WaterPlane} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.pickUp = function(fish, x, y, waterPlane, random) {
    this.cursorPrevious.x = this.cursor.x = x;
    this.cursorPrevious.y = this.cursor.y = y;
    this.move = fish;
    this.offset.x = fish.position.x - this.cursor.x;
    this.offset.y = fish.position.y - this.cursor.y;

    this.createBodySplash(fish.body, waterPlane, random);
};

/**
 * Release any move
 * @param {WaterPlane} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.drop = function(waterPlane, random) {
    if (this.move) {
        this.constellation.drop(this.move);
        this.createBodySplash(this.move.body, waterPlane, random);
        this.move = null;
    }
};