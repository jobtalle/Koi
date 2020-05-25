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
    this.shadowBuffer = null;
    this.atlas = null;
    this.rocks = null;
    this.background = null;
    this.foreground = null;
    this.underwater = null;
    this.water = null;
    this.constellationMeshWater = null;
    this.constellationMeshDepth = null;
    this.spawner = new Spawner(this.constellation);
    this.time = 0;

    this.createRenderables();

    // TODO: This is a debug warp
    for (let i = 0; i < 1500; ++i)
        this.update();
};

Koi.prototype.FRAME_TIME_MAX = 1;
Koi.prototype.UPDATE_RATE = 1 / 14;
Koi.prototype.PREFERRED_SCALE = 95;
Koi.prototype.SIZE_MIN = 8;
Koi.prototype.SIZE_MAX = 13;
Koi.prototype.COLOR_BACKGROUND = Color.fromCSS("earth");

/**
 * Create all renderable objects
 */
Koi.prototype.createRenderables = function() {
    this.constellationMeshWater = this.constellation.makeMeshWater(this.systems.gl, this.random);
    this.constellationMeshDepth = this.constellation.makeMeshDepth(this.systems.gl);

    this.shadowBuffer = new ShadowBuffer(
        this.systems.gl,
        this.systems.width,
        this.systems.height);
    this.atlas = new Atlas(
        this.systems.gl,
        this.systems.patterns,
        this.constellation.getCapacity());
    this.rocks = new Rocks(
        this.systems.gl,
        this.constellation,
        this.random);

    this.systems.stone.setMesh(this.rocks.mesh); // TODO: Still required?
    this.systems.sand.setMesh(this.constellationMeshDepth);

    this.background = new Background(
        this.systems.gl,
        this.systems.sand,
        this.systems.width,
        this.systems.height,
        this.scale);
    this.foreground = new Foreground(
        this.systems.gl,
        this.constellation,
        this.random);
    this.underwater = new RenderTarget(
        this.systems.gl,
        this.systems.width,
        this.systems.height,
        this.systems.gl.RGB,
        this.systems.gl.LINEAR);
    this.water = new WaterPlane(
        this.systems.gl,
        this.systems.width / this.scale,
        this.systems.height / this.scale);

    this.systems.waves.setMesh(this.constellationMeshWater);
    this.systems.vegetation.setMesh(this.foreground.plants.mesh); // TODO: This can be better
};

/**
 * Free all renderable objects
 */
Koi.prototype.freeRenderables = function() {
    this.shadowBuffer.free();
    this.atlas.free();
    this.rocks.free();
    this.background.free();
    this.foreground.free();
    this.underwater.free();
    this.water.free();

    this.constellationMeshWater.free();
    this.constellationMeshDepth.free();
};

/**
 * Start a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchStart = function(x, y) {
    const fish = this.constellation.pick(x / this.scale, y / this.scale);

    if (fish)
        this.mover.pickUp(fish,x / this.scale, y / this.scale, this.water, this.random);
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
    this.mover.drop(this.water, this.random);
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
 * Notify that the renderer has resized
 */
Koi.prototype.resize = function() {
    this.scale = this.getScale(this.systems.width, this.systems.height);
    this.constellation.resize(
        this.systems.width / this.scale,
        this.systems.height / this.scale,
        this.atlas);

    this.freeRenderables();
    this.createRenderables();

    this.constellation.updateAtlas(this.atlas);
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.spawner.update(this.UPDATE_RATE, this.atlas, this.random);
    this.constellation.update(this.atlas, this.water, this.random);
    this.mover.update();

    this.systems.waves.propagate(this.water, this.systems.wavePainter);
};

/**
 * Render the scene
 * @param {Number} deltaTime The amount of time passed since the last frame
 */
Koi.prototype.render = function(deltaTime) {
    this.time += Math.min(this.FRAME_TIME_MAX, deltaTime);

    while (this.time > this.UPDATE_RATE) {
        this.time -= this.UPDATE_RATE;

        this.update(); // TODO: Add separate update step to spread out processing?
    }

    const timeFactor = this.time / this.UPDATE_RATE;

    // Target underwater bufferQuad
    this.underwater.target();

    // Render background
    this.background.render(this.systems.quad);

    // Render fishes
    this.constellation.render(
        this.systems.bodies,
        this.atlas,
        this.systems.width,
        this.systems.height,
        this.scale,
        timeFactor);

    // Target window
    this.systems.targetMain();

    // Clear background
    this.systems.gl.clearColor(this.COLOR_BACKGROUND.r, this.COLOR_BACKGROUND.g, this.COLOR_BACKGROUND.b, 1);
    this.systems.gl.clear(this.systems.gl.COLOR_BUFFER_BIT);

    // Render shaded water
    this.systems.waves.render(
        this.underwater.texture,
        this.water,
        this.systems.width,
        this.systems.height,
        this.scale,
        timeFactor);

    // Render rocks
    this.rocks.render(
        this.systems.stone,
        this.systems.width,
        this.systems.height,
        this.scale);

    // Render foreground
    this.foreground.render(
        this.systems.vegetation,
        this.systems.width,
        this.systems.height,
        this.scale);

    // Render mover
    this.mover.render(
        this.systems.bodies,
        this.atlas,
        this.systems.width,
        this.systems.height,
        this.scale,
        timeFactor);
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.freeRenderables();
};