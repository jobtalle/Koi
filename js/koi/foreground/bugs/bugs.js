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
                0, 0, 0, 0, 1, 0, 0, 1,
                .3, -.3, .1, -.3, 1, 1, 0, .2,
                .3, .3, .1, .3, 1, 0, 1, .2,
                -.3, -.3, -.1, -.3, 1, 1, 0, 1.8,
                -.3, .3, -.1, .3, 1, 0, 1, 1.8
            ],
            [
                0, 1, 2,
                0, 3, 4
            ]
        ));
    this.vao = null;
    this.flap = 0;

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

    this.flap += .2;

    flying.render(
        this.vao,
        this.testMesh,
        spot.position,
        spot.windPosition,
        spot.flex,
        .5 * Math.sin(this.flap) + .5,
        spot.angle,
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