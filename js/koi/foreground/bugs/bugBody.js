/**
 * A bug body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number[]} vertices The vertices
 * @param {Number[]} indices The indices
 * @constructor
 */
const BugBody = function(gl, vertices, indices) {
    this.gl = gl;
    this.vao = null;
    this.mesh = new Mesh(gl, new MeshData(vertices, indices));
    this.flap = 0;
};

/**
 * Render this bug body
 * @param {Vector3} position The position
 * @param {Vector2} windPosition The wind position
 * @param {Vector2} flex The flex vector
 * @param {Number} angle The angle
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @param {Flying} flying The flying objects renderer
 * @param {Air} air The air
 * @param {Number} time The time interpolation factor
 */
BugBody.prototype.render = function(
    position,
    windPosition,
    flex,
    angle,
    width,
    height,
    flying,
    air,
    time) {
    if (!this.vao)
        this.vao = flying.register(this.mesh);

    this.flap += .2;

    flying.render(
        this.vao,
        this.mesh,
        position,
        windPosition,
        flex,
        .5 * Math.sin(this.flap) + .5,
        angle,
        width,
        height,
        air,
        time);
};

/**
 * Free resources maintained by the body
 */
BugBody.prototype.free = function() {
    if (this.vao)
        this.gl.vao.deleteVertexArrayOES(this.vao);

    this.mesh.free();
};