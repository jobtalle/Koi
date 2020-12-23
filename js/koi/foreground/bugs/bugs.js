/**
 * Bugs
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Biome} biome The biome
 * @param {BugSpot[]} bugSpots Bug spots
 * @constructor
 */
const Bugs = function(gl, constellation, biome, bugSpots) {
    this.gl = gl;
    this.constellation = constellation;
    this.pathMaker = new BugPathMaker(constellation, biome, bugSpots);
    this.bugs = [];

    for (const spot of bugSpots)
        spot.normalize(constellation.width, constellation.height);
};

/**
 * Make a bug
 * @param {Random} random A randomizer
 * @returns {Bug} A bug
 */
Bugs.prototype.makeBug = function(random) {
    const path = this.pathMaker.makeEntrance(random);

    if (path)
        return new Bug(
            new BugBodyButterflyYellow(this.gl),
            path);

    return null;
};

/**
 * Update the bugs
 * @param {Random} random A randomizer
 */
Bugs.prototype.update = function(random) {
    if (this.bugs.length < 7) { // TODO: something
        const bug = this.makeBug(random);

        if (bug)
            this.bugs.push(bug);
    }

    for (let bug = this.bugs.length; bug-- > 0;) {
        if (this.bugs[bug].update(this.pathMaker, this.constellation.width, this.constellation.height, random)) {
            this.bugs[bug].free();
            this.bugs.splice(bug, 1);
        }
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