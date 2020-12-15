/**
 * Bugs
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @constructor
 */
const Bugs = function(gl, constellation) {
    this.constellation = constellation;
    this.testMesh = new Mesh(
        gl,
        new MeshData(
            [
                0, 0, 0, 1, 0, 0,
                1, 0, 0, 1, 0, 0,
                0, 1, 0, 1, 0, 0
            ],
            [
                0, 1, 2
            ]
        ));
    this.vao = null;
};

/**
 * Render the bugs
 * @param {Flying} flying The flying objects renderer
 * @param {Air} air The air
 * @param {Number} time The time interpolation factor
 */
Bugs.prototype.render = function(flying, air, time) {
    if (!this.vao)
        this.vao = flying.register(this.testMesh);

    flying.render(
        this.vao,
        this.testMesh,
        new Vector3(4, 4, 0),
        this.constellation.width,
        this.constellation.height,
        air);
};

/**
 * Free the bugs
 */
Bugs.prototype.free = function() {

};