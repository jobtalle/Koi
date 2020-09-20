/**
 * A fish mover for moving fish through user input
 * @param {Constellation} constellation A constellation to move fish in
 * @param {AudioBank} audio Game audio
 * @constructor
 */
const Mover = function(constellation, audio) {
    this.constellation = constellation;
    this.audio = audio;
    this.move = null;
    this.cursor = new Vector2();
    this.cursorPrevious = new Vector2();
    this.offset = new Vector2();
    this.cursorOffset = new Vector2();
    this.touch = false;
};

Mover.prototype.SPLASH_DROP_RADIUS = 0.13;
Mover.prototype.SPLASH_DROP_AMPLITUDE = 0.4;
Mover.prototype.SPLASH_DROP_DISTANCE = 0.1;
Mover.prototype.AIR_RADIUS = 1.5;
Mover.prototype.AIR_INTENSITY = .4;
Mover.prototype.AIR_HEIGHT = .5;

/**
 * Update the mover
 */
Mover.prototype.update = function() {
    if (this.move)
        this.move.body.update(
            this.move.position,
            this.move.direction,
            this.move.speed,
            this.move.size);
};

/**
 * Render the mover
 * @param {Bodies} bodies The bodies renderer
 * @param {Atlas} atlas The atlas containing the fish textures
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Number} time The interpolation factor since the last update
 */
Mover.prototype.render = function(
    bodies,
    atlas,
    width,
    height,
    time) {
    if (this.move) {
        this.move.render(bodies, time);

        bodies.render(atlas, width, height, false, true);
    }
};

/**
 * Move the cursor
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 * @param {Air} air The air to displace
 */
Mover.prototype.touchMove = function(x, y, air) {
    if (this.touch) {
        this.cursorPrevious.set(this.cursor);
        this.cursor.x = x;
        this.cursor.y = y;

        if (this.move) {
            this.cursorOffset.set(this.cursor).add(this.offset);
            this.move.moveTo(this.cursorOffset);
        }

        const intensity = this.AIR_INTENSITY * (this.cursor.x - this.cursorPrevious.x);

        // TODO: This makes very large steps, smooth this out
        air.addDisplacement(x, y + this.AIR_HEIGHT, this.AIR_RADIUS, intensity);
    }
};

/**
 * Check whether this mover has a fish
 * @returns {Boolean} True if a fish is being carried
 */
Mover.prototype.hasFish = function() {
    return this.move !== null;
};

/**
 * Create a fish body shaped splash
 * @param {FishBody} body A fish body
 * @param {Water} water A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.createBodySplash = function(body, water, random) {
    for (let segment = body.spine.length; segment-- > 0;) {
        const angle = Math.PI * 2 * random.getFloat();
        const intensity = body.pattern.shapeBody.sample(segment / (body.spine.length - 1));
        const distance = this.SPLASH_DROP_DISTANCE * intensity;

        water.addFlare(
            body.spine[segment].x + Math.cos(angle) * distance,
            body.spine[segment].y + Math.sin(angle) * distance,
            this.SPLASH_DROP_RADIUS * intensity,
            this.SPLASH_DROP_AMPLITUDE * intensity);
    }
};

/**
 * Start touching the game area
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
Mover.prototype.startTouch = function(x, y) {
    this.cursorPrevious.x = this.cursor.x = x;
    this.cursorPrevious.y = this.cursor.y = y;
    this.touch = true;
};

/**
 * Start a new move
 * @param {Fish} fish The fish that needs to be moved
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 * @param {Water} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.pickUp = function(fish, x, y, waterPlane, random) {
    this.cursorPrevious.x = this.cursor.x = x;
    this.cursorPrevious.y = this.cursor.y = y;
    this.move = fish;
    this.offset.x = fish.position.x - this.cursor.x;
    this.offset.y = fish.position.y - this.cursor.y;
    this.touch = true;

    this.audio.effectFishUp.play();

    console.log(fish); // TODO: For debugging only
    this.createBodySplash(fish.body, waterPlane, random);
};

/**
 * Release any move
 * @param {Water} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.drop = function(waterPlane, random) {
    if (this.move) {
        this.constellation.drop(this.move);
        this.createBodySplash(this.move.body, waterPlane, random);
        this.move = null;

        this.audio.effectFishDown.play();
    }

    this.touch = false;
};