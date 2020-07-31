/**
 * The koi game
 * @param {Systems} systems The render systems
 * @param {Number} environmentSeed The seed for all stable systems
 * @param {Random} random A randomizer
 * @param {WeatherState} weatherState The state of the weather object
 * @param {SpawnerState} spawnerState The state of the spawner object
 * @constructor
 */
const Koi = function(
    systems,
    environmentSeed,
    random,
    weatherState = new WeatherState(),
    spawnerState = new SpawnerState()) {
    this.systems = systems;
    this.random = random;
    this.environmentSeed = environmentSeed;
    this.scale = this.getScale(systems.width, systems.height);
    this.constellation =  new Constellation(
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
    this.air = null;
    this.constellationMeshWater = null;
    this.constellationMeshDepth = null;
    this.randomSource = null;
    this.weather = new Weather(this.constellation, weatherState);
    this.spawner = new Spawner(this.constellation, spawnerState);
    this.time = this.UPDATE_RATE;

    this.createRenderables();
};

Koi.prototype.FRAME_TIME_MAX = 1;
Koi.prototype.UPDATE_RATE = 1 / 14;
Koi.prototype.SCALE_FACTOR = .051;
Koi.prototype.SCALE_MIN = 50;
Koi.prototype.COLOR_BACKGROUND = Color.fromCSS("earth");

/**
 * Serialize the koi
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Koi.prototype.serialize = function(buffer) {
    this.constellation.serialize(buffer);
};

/**
 * Deserialize the koi
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Koi.prototype.deserialize = function(buffer) {
    try {
        this.constellation.deserialize(buffer, this.atlas, this.randomSource);
    }
    catch (error) {
        this.free();

        throw error;
    }
};

/**
 * Create all renderable objects
 */
Koi.prototype.createRenderables = function() {
    const environmentRandomizer = new Random(this.environmentSeed);

    this.randomSource = new RandomSource(this.systems.gl, environmentRandomizer);

    // Create constellation meshes
    this.constellationMeshWater = this.constellation.makeMeshWater(this.systems.gl);
    this.constellationMeshDepth = this.constellation.makeMeshDepth(this.systems.gl);

    // Assign constellation meshes to systems
    this.systems.sand.setMesh(this.constellationMeshDepth);
    this.systems.shadows.setMesh(this.constellationMeshDepth);
    this.systems.blur.setMesh(this.constellationMeshWater);
    this.systems.waves.setMesh(this.constellationMeshWater);
    this.systems.ponds.setMesh(this.constellationMeshWater);

    // Create scene objects
    this.shadowBuffer = new ShadowBuffer(
        this.systems.gl,
        this.constellation.width,
        this.constellation.height);
    this.atlas = new Atlas(
        this.systems.gl,
        this.systems.patterns,
        this.constellation.getCapacity());
    this.background = new Background(
        this.systems.gl,
        this.systems.sand,
        this.systems.blit,
        this.systems.width,
        this.systems.height,
        this.randomSource,
        this.scale);
    this.foreground = new Foreground(
        this.systems.gl,
        this.systems.stone,
        this.systems.vegetation,
        this.constellation,
        environmentRandomizer);
    this.underwater = new RenderTarget(
        this.systems.gl,
        this.systems.width,
        this.systems.height,
        this.systems.gl.RGB,
        false,
        this.systems.gl.LINEAR);
    this.water = new Water(
        this.systems.gl,
        this.constellation.width,
        this.constellation.height);
    this.air = new Air(
        this.systems.gl,
        this.constellation.width,
        this.constellation.height,
        this.random);

    // Assign constellation meshes to objects
    this.background.setMesh(this.constellationMeshDepth);

    // Assign scene object meshes
    this.systems.stone.setMesh(this.foreground.rocks.mesh);
    this.systems.vegetation.setMesh(this.foreground.plants.mesh);

    // Buffer foreground reflections
    this.foreground.makeReflections(
        this.systems.stone,
        this.systems.vegetation,
        this.systems.blur,
        this.systems.quad);
};

/**
 * Free all renderable objects
 */
Koi.prototype.freeRenderables = function() {
    this.randomSource.free();
    this.shadowBuffer.free();
    this.atlas.free();
    this.background.free();
    this.foreground.free();
    this.underwater.free();
    this.water.free();
    this.air.free();

    this.constellationMeshWater.free();
    this.constellationMeshDepth.free();
};

/**
 * Start a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchStart = function(x, y) {
    const wx = this.constellation.getWorldX(x, this.scale);
    const wy = this.constellation.getWorldY(y, this.scale);
    const fish = this.constellation.pick(wx, wy);

    if (fish)
        this.mover.pickUp(fish,wx, wy, this.water, this.random);
    else
        this.mover.startTouch(wx, wy);
};

/**
 * Move a touch event
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Koi.prototype.touchMove = function(x, y) {
    this.mover.touchMove(
        this.constellation.getWorldX(x, this.scale),
        this.constellation.getWorldY(y, this.scale),
        this.air);
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
    return Math.max(this.SCALE_MIN, Math.sqrt(width * width + height * height) * this.SCALE_FACTOR);
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

    this.constellation.updateAtlas(this.atlas, this.randomSource);
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.spawner.update(this.UPDATE_RATE, this.atlas, this.randomSource, this.random);
    this.constellation.update(this.atlas, this.randomSource, this.water, this.random);
    this.weather.update(this.air, this.water, this.random);
    this.mover.update();

    this.systems.waves.propagate(this.water, this.systems.influencePainter);
    this.systems.wind.propagate(this.air, this.systems.influencePainter);
};

/**
 * Render the scene
 * @param {Number} deltaTime The amount of time passed since the last frame
 */
Koi.prototype.render = function(deltaTime) {
    this.time += Math.min(this.FRAME_TIME_MAX, deltaTime);

    while (this.time > this.UPDATE_RATE) {
        this.time -= this.UPDATE_RATE;

        this.update();
    }

    const timeFactor = this.time / this.UPDATE_RATE;

    // Render shadows
    this.shadowBuffer.target();
    this.constellation.render(this.systems.bodies, this.atlas, timeFactor,true);

    // Blur shadows
    this.systems.blur.applyMesh(this.shadowBuffer.renderTarget, this.shadowBuffer.intermediate);

    // Target underwater buffer
    this.underwater.target();

    // Render background
    this.background.render();

    // Render shadows
    this.systems.shadows.render(
        this.shadowBuffer,
        this.systems.height,
        this.scale);

    // Render pond contents
    this.constellation.render(
        this.systems.bodies,
        this.atlas,
        timeFactor,
        false,
        false);

    // Target window
    this.systems.targetMain();

    // Clear background
    this.systems.gl.clearColor(this.COLOR_BACKGROUND.r, this.COLOR_BACKGROUND.g, this.COLOR_BACKGROUND.b, 1);
    this.systems.gl.clear(this.systems.gl.COLOR_BUFFER_BIT | this.systems.gl.DEPTH_BUFFER_BIT);

    // Enable Z buffer
    this.systems.gl.enable(this.systems.gl.DEPTH_TEST);

    // Render foreground
    this.foreground.render(
        this.systems.vegetation,
        this.systems.stone,
        this.air,
        timeFactor);

    // Render shaded water
    this.systems.ponds.render(
        this.underwater.texture,
        this.foreground.reflections.texture,
        this.water,
        this.systems.width,
        this.systems.height,
        this.scale,
        timeFactor);

    // Disable Z buffer
    this.systems.gl.disable(this.systems.gl.DEPTH_TEST);

    // Render mover
    this.mover.render(
        this.systems.bodies,
        this.atlas,
        this.constellation.width,
        this.constellation.height,
        timeFactor);

    // this.systems.quad.render(this.systems.palettes.textureLayer1.texture);
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.freeRenderables();
};