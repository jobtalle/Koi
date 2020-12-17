/**
 * Bugs
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {BugSpot[]} bugSpots Bug spots
 * @constructor
 */
const Bugs = function(gl, constellation, bugSpots) {
    this.constellation = constellation;
    this.bugSpots = bugSpots;
    this.testMesh = new Mesh(
        gl,
        new MeshData(
            [
                0, 0, 1, 0, 0,
                .3, .5, 1, 1, 0,
                -.3, .5, 1, 0, 1
            ],
            [
                0, 1, 2
            ]
        ));
    this.vao = null;

    for (const spot of this.bugSpots)
        spot.normalize(constellation.width, constellation.height);
};

/**
 * Update the bugs
 */
Bugs.prototype.update = function() {

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

    const spot = this.bugSpots[10];

    flying.render(
        this.vao,
        this.testMesh,
        spot.position,
        spot.windPosition,
        spot.flex,
        this.constellation.width,
        this.constellation.height,
        air,
        time);
};

/**
 * Free the bugs
 */
Bugs.prototype.free = function() {

};