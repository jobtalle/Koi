/**
 * A fish mover for moving fish through user input
 * @param {Constellation} constellation A constellation to move fish in
 * @param {AudioBank} audio Game audio
 * @param {GUI} gui The GUI
 * @constructor
 */
const Mover = function(constellation, audio, gui) {
    this.constellation = constellation;
    this.audio = audio;
    this.gui = gui;
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
Mover.prototype.BIG_THRESHOLD = 2;

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
 * Play the fish specific interaction sound
 * @param {Fish} fish The fish to play the sound for
 * @param {Number} pan The pan in the range [-1, 1]
 */
Mover.prototype.playInteractionSound = function(fish, pan) {
    if (fish.getWeight() > this.BIG_THRESHOLD)
        this.audio.effectFishMoveBig.play(this.audio.effectFishMoveBig.engine.transformPan(pan));
    else
        this.audio.effectFishMoveSmall.play(this.audio.effectFishMoveSmall.engine.transformPan(pan));
};

/**
 * Start a new move
 * @param {Fish} fish The fish that needs to be moved
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 * @param {Water} [waterPlane] A water plane to splash on, null if fish does not come from water
 * @param {Random} [random] A randomizer
 */
Mover.prototype.pickUp = function(fish, x, y, waterPlane = null, random = null) {
    const pan = 2 * fish.position.x / this.constellation.width - 1;

    this.cursorPrevious.x = this.cursor.x = x;
    this.cursorPrevious.y = this.cursor.y = y;
    this.move = fish;
    this.offset.x = fish.position.x - this.cursor.x;
    this.offset.y = fish.position.y - this.cursor.y;
    this.touch = true;

    if (waterPlane) {
        this.audio.effectFishUp.play(this.audio.effectFishUp.engine.transformPan(pan));

        this.playInteractionSound(fish, pan);

        console.log(fish.getWeight().toFixed(2) + "kg");
        console.log(fish); // TODO: For debugging only
        this.createBodySplash(fish.body, waterPlane, random);

        this.gui.cards.hand.hide();
    }
};

/**
 * Create a drop effect for a fish
 * @param {Fish} fish A fish
 * @param {Water} waterPlane A water plane to splash on
 * @param {Random} random A randomizer
 */
Mover.prototype.dropEffect = function(fish, waterPlane, random) {
    const pan = 2 * fish.position.x / this.constellation.width - 1;

    this.audio.effectFishDown.play(this.audio.effectFishDown.engine.transformPan(pan));
    this.playInteractionSound(fish, pan);
    this.createBodySplash(fish.body, waterPlane, random);
};

/**
 * Release any move
 * @param {Water} waterPlane A water plane to splash on
 * @param {Atlas} atlas The atlas
 * @param {Number} scale The world scale
 * @param {Random} random A randomizer
 */
Mover.prototype.drop = function(waterPlane, atlas, scale, random) {
    if (this.move) {
        const x = this.constellation.getPixelX(this.move.position.x, scale);
        const y = this.constellation.getPixelY(this.move.position.y, scale);

        if (this.gui.cards.onDropTarget(x, y)) {
            const card = new Card(
                this.move.body,
                this.move.position.copy().subtract(this.offset).multiply(scale).round());

            this.gui.cards.add(card);
            this.gui.cards.toDropTarget(card);

            this.move.free(atlas);
        }
        else {
            this.dropEffect(this.move, waterPlane, random);

            this.constellation.drop(this.move);
        }

        this.move = null;

        this.gui.cards.hand.show();
    }

    this.touch = false;
};