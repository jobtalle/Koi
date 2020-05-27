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
    for (let i = 0; i < 50; ++i) {
        this.createPillar(
            vertices,
            indices,
            random.getFloat() * constellation.width,
            random.getFloat() * constellation.height,
            .5 + .5 * random.getFloat(),
            1 + .5 * random.getFloat());
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
    const firstIndex = vertices.length / 6;
    const precision = 10; // TODO: Depends on radius
    let lastStep = precision - 1;

    for (let step = 0; step < precision; ++step) {
        const radians = Math.PI * 2 * step / precision;
        const dx = Math.cos(radians) * radius;
        const dy = Math.sin(radians) * radius;

        vertices.push(
            this.COLOR_SIDE.r,
            this.COLOR_SIDE.g,
            this.COLOR_SIDE.b,
            x + dx,
            y + dy,
            0,
            this.COLOR_SIDE.r,
            this.COLOR_SIDE.g,
            this.COLOR_SIDE.b,
            x + dx,
            y + dy,
            height,
            this.COLOR_TOP.r,
            this.COLOR_TOP.g,
            this.COLOR_TOP.b,
            x + dx,
            y + dy,
            height);
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