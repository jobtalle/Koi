/**
 * The koi game
 * @param {Systems} systems The render systems
 * @param {Random} random A randomizer
 * @constructor
 */
const Koi = function(systems, random) {
    this.systems = systems;
    this.random = random;
    this.scale = this.getScale(systems.width, systems.height);
    this.constellation = new Constellation(
        systems.width / this.scale,
        systems.height / this.scale);
    this.mover = new Mover(this.constellation);
    this.lastUpdate = new Date();
    this.atlas = new Atlas(systems.gl, systems.patterns, this.constellation.getCapacity());
    this.spawner = new Spawner(this.constellation);
    this.time = 0;

    // TODO: This is a debug warp
    for (let i = 0; i < 1000; ++i)
        this.update();
};

Koi.prototype.UPDATE_RATE = 1 / 15;
Koi.prototype.PREFERRED_SCALE = 80;
Koi.prototype.SIZE_MIN = 11;
Koi.prototype.SIZE_MAX = 13;

/**
 * Start a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchStart = function(x, y) {
    const fish = this.constellation.pick(x / this.scale, y / this.scale);

    if (fish)
        this.mover.pickUp(fish,x / this.scale, y / this.scale);
};

/**
 * Move a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchMove = function(x, y) {
    this.mover.touchMove(x / this.scale, y / this.scale);
};

/**
 * End a touch event
 */
Koi.prototype.touchEnd = function() {
    this.mover.drop();
};

/**
 * Calculate the scene scale
 * @param {Number} width The view width in pixels
 * @param {Number} height The view height in pixels
 */
Koi.prototype.getScale = function(width, height) {
    const minSize = Math.min(width, height);

    return Math.max(Math.min(this.PREFERRED_SCALE, minSize / this.SIZE_MIN), minSize / this.SIZE_MAX);
};

/**
 * Replace the atlas by a new one, the old one was too small
 */
Koi.prototype.replaceAtlas = function() {
    this.atlas.free();
    this.atlas = new Atlas(this.systems.gl, this.systems.patterns, this.constellation.getCapacity());

    this.constellation.updateAtlas(this.atlas);
};

/**
 * Notify that the renderer has resized
 */
Koi.prototype.resize = function() {
    this.scale = this.getScale(this.systems.width, this.systems.height);
    this.constellation.resize(
        this.systems.width / this.scale,
        this.systems.height / this.scale,
        this.atlas);

    if (this.constellation.getCapacity() > this.atlas.capacity)
        this.replaceAtlas();
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.spawner.update(this.UPDATE_RATE, this.atlas, this.random);
    this.constellation.update(this.atlas, this.random);
    this.mover.update();

    this.lastUpdate = new Date();
};

/**
 * Render the scene
 * @param {Number} deltaTime The amount of time passed since the last frame
 */
Koi.prototype.render = function(deltaTime) {
    this.time += deltaTime;

    while (this.time > this.UPDATE_RATE) {
        this.time -= this.UPDATE_RATE;

        this.update();
    }

    const timeFactor = this.time / this.UPDATE_RATE;

    this.systems.targetMain();
    this.systems.clear(new Color(.2, .2, .2));

    this.systems.primitives.setViewport(this.systems.width, this.systems.height);
    this.systems.primitives.transformPush();
    this.systems.primitives.getTransform().scale(this.scale, this.scale);

    this.constellation.render(this.systems.primitives, timeFactor);
    this.mover.render(this.systems.primitives, timeFactor);

    this.systems.primitives.transformPop();

    this.systems.primitives.cutStrip(0, 0, 0, 0);
    this.systems.primitives.drawStrip(0, 400,0, 1);
    this.systems.primitives.cutStrip(400, 400,1, 1);
    this.systems.primitives.cutStrip(0, 0, 0, 0);
    this.systems.primitives.drawStrip(400, 0,1, 0);
    this.systems.primitives.cutStrip(400, 400,1, 1);

    this.systems.primitives.flush();
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.atlas.free();
};