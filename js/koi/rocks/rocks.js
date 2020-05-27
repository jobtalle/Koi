/**
 * The rocky terrain surrounding the ponds
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 * @constructor
 */
const Rocks = function(gl, constellation, random) {
    this.mesh = this.createMesh(gl, constellation, random);
};

Rocks.prototype.COLOR_TOP = Color.fromCSS("rock-top");
Rocks.prototype.COLOR_SIDE = Color.fromCSS("rock-side");
Rocks.prototype.RESOLUTION = .1;

/**
 * Create the rocks mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 */
Rocks.prototype.createMesh = function(gl, constellation, random) {
    const vertices = [];
    const indices = [];

    // TODO: Rocks
    for (let i = 0; i < 40; ++i) {
        const angle = Math.PI * 2 * random.getFloat();

        this.createPillar(
            vertices,
            indices,
            constellation.big.constraint.position.x + Math.cos(angle) * constellation.big.constraint.radius *
                (1 + .2 * Constellation.prototype.FACTOR_PADDING),
            constellation.big.constraint.position.y + Math.sin(angle) * constellation.big.constraint.radius *
                (1 + .2 * Constellation.prototype.FACTOR_PADDING),
            .2 + .2 * random.getFloat(),
            .2 + .3 * random.getFloat());
    }

    return new Mesh(gl, vertices, indices);
};

/**
 * Model a pillar
 * @param {Number[]} vertices The vertices
 * @param {Number[]} indices The indices
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 * @param {Number} radius The pillar radius
 * @param {Number} height The pillar height
 */
Rocks.prototype.createPillar = function(
    vertices,
    indices,
    x,
    y,
    radius,
    height) {
    const top = 1.1;
    const squish = .65;
    const firstIndex = vertices.length / 7;
    const precision = Math.ceil(2 * Math.PI * radius / this.RESOLUTION);
    const zShift = (-.5 + random.getFloat()) * .5;
    const lightTop = .8 - zShift * .4;
    let lastStep = precision - 1;
    // TODO: Skip back faces

    for (let step = 0; step < precision; ++step) {
        const radians = Math.PI * 2 * step / precision;
        const dx = Math.cos(radians) * radius;
        const dy = Math.sin(radians) * radius * squish;
        const l = Math.sqrt(dx * dx + dy * dy);
        const lx = 1 / Math.sqrt(2);
        const ly = 1 / Math.sqrt(2);
        const nx = dx / l;
        const ny = dy / l;
        const baseLight = 1;
        const ambient = .6;
        const light = ambient + (1 - ambient) * Math.max(0, nx * lx + ny * ly);

        vertices.push(
            this.COLOR_SIDE.r,
            this.COLOR_SIDE.g,
            this.COLOR_SIDE.b,
            light * baseLight,
            x + dx,
            y + dy,
            0,
            this.COLOR_SIDE.r,
            this.COLOR_SIDE.g,
            this.COLOR_SIDE.b,
            light,
            x + dx * top,
            y + dy * top,
            height + dx * zShift * top,
            this.COLOR_TOP.r,
            this.COLOR_TOP.g,
            this.COLOR_TOP.b,
            lightTop,
            x + dx * top,
            y + dy * top,
            height + dx * zShift * top);
        indices.push(
            firstIndex + lastStep * 3,
            firstIndex + lastStep * 3 + 1,
            firstIndex + step * 3 + 1,
            firstIndex + step * 3 + 1,
            firstIndex + step * 3,
            firstIndex + lastStep * 3,
            firstIndex + precision * 3,
            firstIndex + lastStep * 3 + 2,
            firstIndex + step * 3 + 2);

        lastStep = step;
    }

    vertices.push(
        this.COLOR_TOP.r,
        this.COLOR_TOP.g,
        this.COLOR_TOP.b,
        lightTop,
        x,
        y,
        height);
};

/**
 * Render the rocks
 * @param {Stone} stone The stone renderer
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Rocks.prototype.render = function(stone, width, height, scale) {
    stone.render(width, height, scale);
};

/**
 * Free all resources maintained by this object
 */
Rocks.prototype.free = function() {
    this.mesh.free();
};