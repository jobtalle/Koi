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

    return new Mesh(gl, vertices, indices);
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