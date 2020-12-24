/**
 * A bug body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Vector2} flex The flex vector during flight
 * @param {Number} flexAngle The maximum amount of rotation caused by wind gusts
 * @param {Sampler} speed The flying speed sampler
 * @param {Sampler} rotation The rotation change sampler
 * @param {Boolean} resistant True if the bug resists rain
 * @param {Number[]} vertices The vertices
 * @param {Number[]} indices The indices
 * @constructor
 */
const BugBody = function(
    gl,
    flex,
    flexAngle,
    speed,
    rotation,
    resistant,
    vertices,
    indices) {
    this.gl = gl;
    this.flex = flex;
    this.flexAngle = flexAngle;
    this.speed = speed;
    this.rotation = rotation;
    this.resistant = resistant;
    this.vao = null;
    this.mesh = new Mesh(gl, new MeshData(vertices, indices));
    this.flap = 0;
    this.flapPrevious = this.flap;
};

/**
 * Update the bug body
 * @param {Boolean} idle True if the bug is currently idle
 * @param {Random} random A randomizer
 */
BugBody.prototype.update = function(idle, random) {
    this.flapPrevious = this.flap;
};

/**
 * Render this bug body
 * @param {Vector3} position The position
 * @param {Vector2} windPosition The wind position
 * @param {Vector2} flex The flex vector
 * @param {Number} flexAngle The flex angle
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
    flexAngle,
    angle,
    width,
    height,
    flying,
    air,
    time) {
    if (!this.vao)
        this.vao = flying.register(this.mesh);

    const flapDelta = this.flap >= this.flapPrevious ?
        this.flap - this.flapPrevious :
        1 - this.flapPrevious + this.flap;
    const flapPhase = this.flapPrevious + flapDelta * time;

    flying.render(
        this.vao,
        this.mesh,
        position,
        windPosition,
        flex,
        .5 + Math.sin(Math.PI * 2 * flapPhase) * .5,
        flexAngle,
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