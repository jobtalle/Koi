/**
 * Plants
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Slots} slots The slots to place objects on
 * @param {Random} random A randomizer
 * @constructor
 */
const Plants = function(gl, constellation, slots, random) {
    this.mesh = this.makeMesh(gl, constellation, slots, random);
};

/**
 * Make the vegetation mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Slots} slots The slots to place objects on
 * @param {Random} random A randomizer
 */
Plants.prototype.makeMesh = function(gl, constellation, slots, random) {
    const vertices = [];
    const indices = [];

    for (const slot of slots.slots) if (slot)
        this.makeBlade(slot.x, slot.y, vertices, indices);

    return new Mesh(gl, vertices, indices);
};

/**
 * Make a grass blade
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.makeBlade = function(x, y, vertices, indices) {
    const firstIndex = vertices.length / 7;
    const height = .5;
    const radius = .05;
    const steps = 4;
    const color = Color.fromCSS("grass");

    for (let step = 0; step < steps - 1; ++step) {
        const f = step / (steps - 1);
        const r = radius * (1 - f);
        const flexibility = Math.pow(f, 3.5);

        vertices.push(
            color.r,
            color.g,
            color.b,
            x - r,
            y,
            height * f,
            flexibility);
        vertices.push(
            color.r,
            color.g,
            color.b,
            x + r,
            y,
            height * f,
            flexibility);

        if (step !== steps - 2)
            indices.push(
                firstIndex + (step << 1),
                firstIndex + (step << 1) + 1,
                firstIndex + (step << 1) + 3,
                firstIndex + (step << 1) + 3,
                firstIndex + (step << 1) + 2,
                firstIndex + (step << 1));
        else
            indices.push(
                firstIndex + (step << 1),
                firstIndex + (step << 1) + 1,
                firstIndex + (step << 1) + 2);
    }

    vertices.push(
        color.r,
        color.g,
        color.b,
        x,
        y,
        height,
        1);
};

/**
 * Free all resources maintained by plants
 */
Plants.prototype.free = function() {
    this.mesh.free();
};