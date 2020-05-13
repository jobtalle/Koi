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

Mover.prototype.SPLASH_DROP_RADIUS = 0.13;
Mover.prototype.SPLASH_DROP_AMPLITUDE = -1.7;
Mover.prototype.SPLASH_DROP_DISTANCE = 0.2;

/**
 * Update the mover
 */
Mover.prototype.update = function() {
    if (this.move)
        this.move.body.update(
            this.move.position,
            this.move.direction,
            this.move.speed,
            null);
};

/**
 * Render the mover
 * @param {Primitives} primitives The primitives renderer
 * @param {WebGLTexture} atlas The atlas texture
 * @param {Number} scale The render scale
 * @param {Number} time The interpolation factor since the last update
 */
Mover.prototype.render = function(primitives, atlas, scale, time) {
    if (this.move) {
        primitives.transformPush();
        primitives.getTransform().scale(scale, scale);
        primitives.setTexture(atlas);
        primitives.gl.enable(primitives.gl.BLEND);
        primitives.gl.blendFunc(primitives.gl.SRC_ALPHA, primitives.gl.ONE_MINUS_SRC_ALPHA);

        this.move.render(primitives, time);

        primitives.transformPop();
        primitives.gl.disable(primitives.gl.BLEND);
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
 * @param {Number} direction The drop direction, -1 for up and 1 for down
 * @param {Random} random A randomizer
 */
Mover.prototype.createBodySplash = function(body, waterPlane, direction, random) {
    for (let segment = body.spine.length; segment-- > 0;) {
        const angle = Math.PI * 2 * random.getFloat();
        const intensity = body.pattern.shape.sample(segment / (body.spine.length - 1));
        const distance = Math.sqrt(random.getFloat()) * this.SPLASH_DROP_DISTANCE * intensity;

        waterPlane.addFlare(
            body.spine[segment].x + Math.cos(angle) * distance,
            body.spine[segment].y + Math.sin(angle) * distance,
            this.SPLASH_DROP_RADIUS * intensity,
            this.SPLASH_DROP_AMPLITUDE * intensity * direction);
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

    this.createBodySplash(fish.body, waterPlane, 1, random);
};

/**
 * Release any move
 * @param {WaterPlane} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.drop = function(waterPlane, random) {
    if (this.move) {
        this.constellation.drop(this.move);
        this.createBodySplash(this.move.body, waterPlane, -1, random);
        this.move = null;
    }
};