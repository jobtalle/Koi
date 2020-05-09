/**
 * The koi game
 * @param {Renderer} renderer The renderer
 * @param {Random} random A randomizer
 * @constructor
 */
const Koi = function(renderer, random) {
    this.renderer = renderer;
    this.random = random;
    this.scale = this.getScale(renderer.getWidth(), renderer.getHeight());
    this.constellation = new Constellation(
        renderer.getWidth() / this.scale,
        renderer.getHeight() / (this.scale * this.Y_SCALE));
    this.lastUpdate = new Date();
    // TODO: Atlas capacity may overflow!
    this.atlas = new Atlas(renderer, this.constellation.getCapacity());
    this.spawner = new Spawner(this.constellation);
    this.dragging = null;
    this.dragPoint = new Vector2();

    // TODO: This is a debug warp
    for (let i = 0; i < 2000; ++i)
        this.update();
};

Koi.prototype.UPDATE_RATE = 1 / 15;
Koi.prototype.PREFERRED_SCALE = 80;
Koi.prototype.SIZE_MIN = 11;
Koi.prototype.SIZE_MAX = 13;
Koi.prototype.Y_SCALE = .75;

/**
 * Start a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchStart = function(x, y) {
    this.dragging = this.constellation.pick(x / this.scale, y / (this.scale * this.Y_SCALE));
    this.dragPoint.x = x / this.scale;
    this.dragPoint.y = y / (this.scale * this.Y_SCALE);
};

/**
 * Move a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchMove = function(x, y) {
    // TODO: Make this scale operation a vector by vector multiplication
    if (this.dragging) {
        this.dragPoint.x = x / this.scale;
        this.dragPoint.y = y / (this.scale * this.Y_SCALE);
    }
};

/**
 * End a touch event
 */
Koi.prototype.touchEnd = function() {
    if (this.dragging) {
        this.dragging.direction.set(this.dragging.body.spine[0]).subtract(this.dragging.body.spine[1]).normalize();
        this.dragging.velocity.set(this.dragging.direction);
        this.dragging.speed = this.dragging.SPEED_SLOW;
        this.dragging.boostSpeed(this.random);

        this.constellation.drop(this.dragging);
        this.dragging = null;
    }
};

/**
 * Calculate the scene scale
 * @param {Number} width The view width in pixels
 * @param {Number} height The view height in pixels
 */
Koi.prototype.getScale = function(width, height) {
    const minSize = Math.min(width, height / this.Y_SCALE);

    return Math.max(Math.min(this.PREFERRED_SCALE, minSize / this.SIZE_MIN), minSize / this.SIZE_MAX);
};

/**
 * Notify that the renderer has resized
 */
Koi.prototype.resize = function() {
    this.scale = this.getScale(renderer.getWidth(), renderer.getHeight());
    this.constellation.resize(
        renderer.getWidth() / this.scale,
        renderer.getHeight() / (this.scale * this.Y_SCALE));
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.spawner.update(this.UPDATE_RATE, this.atlas, this.random);
    this.constellation.update(this.atlas, this.random);

    if (this.dragging) {
        this.dragging.body.updateDrag(this.dragPoint);
        this.dragging.position.set(this.dragPoint);
    }

    this.lastUpdate = new Date();
};

/**
 * Render the scene
 */
Koi.prototype.render = function() {
    let time = .001 * (new Date() - this.lastUpdate) / this.UPDATE_RATE;

    while (time > 1) {
        time -= 1;

        this.update();
    }

    this.renderer.clear();
    this.renderer.transformPush();
    this.renderer.getTransform().scale(this.scale, this.scale * this.Y_SCALE);

    this.constellation.render(this.renderer, time);

    this.renderer.transformPop();

    if (this.dragging) {
        this.renderer.transformPush();
        this.renderer.getTransform().scale(this.scale, this.scale);
        this.renderer.getTransform().translate(
            0,
            (this.Y_SCALE - 1) * (this.dragging.body.spinePrevious[0].y +
            (this.dragging.body.spine[0].y - this.dragging.body.spinePrevious[0].y) * time));

        this.dragging.render(this.renderer, time);

        this.renderer.transformPop();
    }

    this.renderer.cutStrip(0, 0, 0, 0);
    this.renderer.drawStrip(0, 400,0, 1);
    this.renderer.cutStrip(400, 400,1, 1);
    this.renderer.cutStrip(0, 0, 0, 0);
    this.renderer.drawStrip(400, 0,1, 0);
    this.renderer.cutStrip(400, 400,1, 1);

    this.renderer.flush();
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.atlas.free();
};