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
    this.window = 0;
    this.windowWidth = .5;
};

Rain.prototype.WINDOW_SIZE_MIN = .1;
Rain.prototype.WINDOW_SIZE_MAX = .7;
Rain.prototype.DROP_LENGTH = 1;
Rain.prototype.DROP_DISTANCE_SAMPLER = new SamplerPlateau(8, 10, 12, 0);
Rain.prototype.DROP_ALPHA = .7;
Rain.prototype.CELL = .3;
Rain.prototype.CELL_RANDOM = .8;
Rain.prototype.CELL_OVERSHOOT = Rain.prototype.DROP_LENGTH;
Rain.prototype.WINDOW_SPEED = .003;

/**
 * Make the raindrop landing positions
 * @param {Constellation} constellation The constellation
 * @param {Random} random A randomizer
 * @returns {Vector2[]} The positions
 */
Rain.prototype.makePositions = function(constellation, random) {
    const xCells = Math.ceil(constellation.width / this.CELL);
    const yCells = Math.ceil((constellation.height + this.CELL_OVERSHOOT) / this.CELL);
    const positions = [];

    for (let y = 0; y < yCells; ++y) for (let x = 0; x < xCells; ++x)
        positions.splice(
            Math.floor(random.getFloat() * (positions.length + 1)),
            0,
            new Vector2(
                this.CELL * (x + random.getFloat() * this.CELL_RANDOM),
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
        6,
        [0],
        [1],
        [],
        [2, 5]);

    for (let position = 0, positionCount = positions.length; position < positionCount; ++position) {
        const threshold = position / (positionCount + 1);
        const distance = this.DROP_DISTANCE_SAMPLER.sample(random.getFloat());

        vertices.push(
            positions[position].x,
            positions[position].y,
            this.DROP_LENGTH,
            this.DROP_ALPHA,
            threshold,
            distance,
            positions[position].x,
            positions[position].y,
            0,
            0,
            threshold,
            distance);
    }

    normalizer.apply(vertices);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    return buffer;
};

/**
 * Update the rain animation
 * @param {Water} water The water
 */
Rain.prototype.update = function(water) {
    // TODO: Be idle when it's not raining

    if ((this.window += this.WINDOW_SPEED) > 1)
        this.window -= 1;

    // TODO: Create drops of drops falling off
};

/**
 * Render the raindrops
 * @param {Drops} drops The drops renderer
 * @param {Number} time The interpolation factor
 */
Rain.prototype.render = function(drops, time) {
    drops.render(this.dropCount, this.window + time * this.WINDOW_SPEED, .2);
};

/**
 * Free the rain resources
 */
Rain.prototype.free = function() {
    this.gl.deleteBuffer(this.mesh);
};