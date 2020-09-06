/**
 * The rain generator
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Random} random A randomizer
 * @constructor
 */
const Rain = function(gl, constellation, random) {
    this.gl = gl;
    this.positions = this.makePositions(constellation, random);
    this.dropCount = this.positions.length;
    this.mesh = this.makeMesh(this.positions, constellation.width, constellation.height, random);
    this.window = this.windowPrevious = 0;
    this.amount = this.amountPrevious = 0;
    this.speed = 0;
    this.lastDrop = 0;

    for (let drop = 0; drop < this.dropCount; ++drop)
        if (!constellation.contains(this.positions[drop].x, this.positions[drop].y))
            this.positions[drop] = null;
};

Rain.prototype.DROP_LENGTH = .6;
Rain.prototype.DROP_DISTANCE = 10;
Rain.prototype.DROP_FALL_PORTION = 1 - Rain.prototype.DROP_LENGTH / Rain.prototype.DROP_DISTANCE;
Rain.prototype.DROP_ALPHA = .7;
Rain.prototype.DROP_ANGLE = Math.PI * 0.55;
Rain.prototype.DROP_ANGLE_RADIUS = Math.PI * 0.015;
Rain.prototype.DROP_ANGLE_SAMPLER = new SamplerPlateau(
    Rain.prototype.DROP_ANGLE - Rain.prototype.DROP_ANGLE_RADIUS,
    Rain.prototype.DROP_ANGLE,
    Rain.prototype.DROP_ANGLE + Rain.prototype.DROP_ANGLE_RADIUS,
    3);
Rain.prototype.DROP_EFFECT_RADIUS = 0.1;
Rain.prototype.DROP_EFFECT_DISPLACEMENT = 0.175;
Rain.prototype.CELL = .3;
Rain.prototype.CELL_RANDOM = .8;
Rain.prototype.CELL_OVERSHOOT_X = -Math.cos(Rain.prototype.DROP_ANGLE) * Rain.prototype.DROP_DISTANCE;
Rain.prototype.CELL_OVERSHOOT_Y = Rain.prototype.DROP_LENGTH;

/**
 * Make the raindrop landing positions
 * @param {Constellation} constellation The constellation
 * @param {Random} random A randomizer
 * @returns {Vector2[]} The positions
 */
Rain.prototype.makePositions = function(constellation, random) {
    const xCells = Math.ceil((constellation.width + Math.abs(this.CELL_OVERSHOOT_X)) / this.CELL);
    const yCells = Math.ceil((constellation.height + this.CELL_OVERSHOOT_Y) / this.CELL);
    const xStart = Math.min(0, this.CELL_OVERSHOOT_X);
    const positions = [];

    for (let y = 0; y < yCells; ++y) for (let x = 0; x < xCells; ++x)
        positions.splice(
            Math.floor(random.getFloat() * (positions.length + 1)),
            0,
            new Vector2(
                this.CELL * (x + random.getFloat() * this.CELL_RANDOM) + xStart,
                this.CELL * (y + random.getFloat() * this.CELL_RANDOM)));

    return positions;
};

/**
 * Make the rain mesh
 * @param {Vector2[]} positions The droplet positions
 * @param {Number} width The constellation width
 * @param {Number} height The constellation height
 * @param {Random} random A randomizer
 * @returns {WebGLBuffer} the mesh vertices
 */
Rain.prototype.makeMesh = function(positions, width, height, random) {
    const vertices = [];
    const buffer = this.gl.createBuffer();
    const normalizer = new MeshNormalizer(
        width,
        height,
        7,
        [0, 3],
        [1],
        [],
        [2, 4]);

    for (let position = 0, positionCount = positions.length; position < positionCount; ++position) {
        const threshold = position / (positionCount + 1);
        const angle = this.DROP_ANGLE_SAMPLER.sample(random.getFloat());
        const dx = Math.cos(angle);
        const dz = Math.sin(angle);

        vertices.push(
            positions[position].x - dx * this.DROP_LENGTH,
            positions[position].y,
            -dz * this.DROP_LENGTH,
            positions[position].x + dx * (this.DROP_DISTANCE - this.DROP_LENGTH),
            dz * (this.DROP_DISTANCE - this.DROP_LENGTH),
            this.DROP_ALPHA,
            threshold,
            positions[position].x,
            positions[position].y,
            0,
            positions[position].x + dx * this.DROP_DISTANCE,
            dz * this.DROP_DISTANCE,
            0,
            threshold);
    }

    normalizer.apply(vertices);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    return buffer;
};

/**
 * Start the rain
 * @param {Number} speed The speed of a droplet in fraction per frame
 * @param {Number} amount The portion of visible particles in the range [0, 1]
 */
Rain.prototype.start = function(speed, amount) {
    this.speed = speed;
    this.amount = amount;
    this.lastDrop = Math.round(this.dropCount * (this.window - amount));

    if (this.lastDrop < 0)
        this.lastDrop += this.dropCount;
};

/**
 * Update the rain animation
 * @param {Water} water The water
 * @param {Number} transition The transition progress
 */
Rain.prototype.update = function(water, transition) {
    this.windowPrevious = this.window;
    this.amountPrevious = this.amount;

    if ((this.window += this.speed * this.amount) > 1)
        --this.window;

    let tail = this.window - this.amount * this.DROP_FALL_PORTION;

    if (tail < 0)
        ++tail;

    const last = Math.floor(this.dropCount * tail) % this.dropCount;

    for (let drop = (this.lastDrop + 1) % this.dropCount; drop !== last;) {
        if (this.positions[drop])
            water.addFlare(
                this.positions[drop].x,
                this.positions[drop].y,
                this.DROP_EFFECT_RADIUS,
                this.DROP_EFFECT_DISPLACEMENT * transition);

        if (++drop === this.dropCount)
            drop = 0;
    }

    this.lastDrop = last - 1;
};

/**
 * Render the raindrops
 * @param {Drops} drops The drops renderer
 * @param {Number} transition The transition progress
 * @param {Number} time The interpolation factor
 * @returns {Number} The rain intensity in the range [0, 1]
 */
Rain.prototype.render = function(drops, transition, time) {
    let windowDelta = this.window - this.windowPrevious;

    if (Math.abs(windowDelta) > 1 - Math.abs(windowDelta))
        windowDelta -= Math.sign(windowDelta);

    let amount = this.amountPrevious + (this.amount - this.amountPrevious) * time;
    let window = this.windowPrevious + windowDelta * time;

    if (amount > 1)
        --amount;

    if (window > 1)
        --window;

    drops.render(
        this.dropCount,
        window,
        amount,
        transition);

    return transition;
};

/**
 * Free the rain resources
 */
Rain.prototype.free = function() {
    this.gl.deleteBuffer(this.mesh);
};