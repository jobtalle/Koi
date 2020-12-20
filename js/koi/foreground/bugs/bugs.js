/**
 * Bugs
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {BugSpot[]} bugSpots Bug spots
 * @constructor
 */
const Bugs = function(gl, constellation, bugSpots) {
    this.gl = gl;
    this.constellation = constellation;
    this.pathMaker = new BugPathMaker(constellation, bugSpots);
    this.bugs = [];

    for (const spot of bugSpots)
        spot.normalize(constellation.width, constellation.height);
};

// /**
//  * Make a bug path
//  * @param {Random} random A randomizer
//  * @returns {BugPath} A bug path
//  */
// Bugs.prototype.makePath = function(random) {
//     return new BugPath([
//         new BugPathNodeAir(new Vector3(-this.PATH_EDGE_PADDING, 5, 1)),
//         new BugPathNodeAir(new Vector3(4, 4, 1)),
//         new BugPathNodeAir(new Vector3(5, 6, 1)),
//         new BugPathNodeAir(new Vector3(3, 8, 1)),
//         new BugPathNodeSpot(this.bugSpots[5]),
//         new BugPathNodeAir(new Vector3(8, 7, 1)),
//         new BugPathNodeAir(new Vector3(8, this.constellation.height + this.PATH_EDGE_PADDING, 1))
//     ]);
// };

/**
 * Make a bug
 * @param {Random} random A randomizer
 * @returns {Bug} A bug
 */
Bugs.prototype.makeBug = function(random) {
    const path = this.pathMaker.makeEntrance(random);

    if (path)
        return new Bug(
            new BugBodyButterfly(this.gl),
            this.pathMaker.makeEntrance(random));

    return null;
};

/**
 * Update the bugs
 * @param {Random} random A randomizer
 */
Bugs.prototype.update = function(random) {
    if (this.bugs.length < 1) {
        const bug = this.makeBug(random);

        if (bug)
            this.bugs.push(bug);
    }

    for (let bug = this.bugs.length; bug-- > 0;) if (this.bugs[bug].update()) {
        this.bugs[bug].free();

        this.bugs.splice(bug, 1);
    }
};

/**
 * Render the bugs
 * @param {Flying} flying The flying objects renderer
 * @param {Air} air The air
 * @param {Number} time The time interpolation factor
 */
Bugs.prototype.render = function(flying, air, time) {
    for (const bug of this.bugs)
        bug.render(this.constellation.width, this.constellation.height, flying, air, time);
};

/**
 * Free the bugs
 */
Bugs.prototype.free = function() {
    for (const bug of this.bugs)
        bug.free();
};