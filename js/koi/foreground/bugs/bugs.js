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
    this.spawner = new BugSpawner(constellation);
    this.bugs = null;

    for (const spot of bugSpots)
        spot.normalize(constellation.width, constellation.height);
};

/**
 * Create the initial bugs
 * @param {WeatherState} weatherState The weather state
 * @param {Random} random A randomizer
 */
Bugs.prototype.initialize = function(weatherState, random) {
    if (this.bugs)
        for (const bug of this.bugs)
            bug.free(this.pathMaker);

    this.bugs = this.spawner.spawnInitial(this.gl, weatherState, this.pathMaker, random);
};

/**
 * Displace sitting bugs
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} direction The direction of the displacement motion in radians
 * @param {Number} radius The displacement radius
 * @param {Random} random A randomizer
 */
Bugs.prototype.displace = function(x, y, direction, radius, random) {
    for (const bug of this.bugs) {
        const dx = bug.position.x - x;
        const dy = bug.position.y - y;

        if (dx * dx + dy * dy < radius * radius)
            bug.displace(this.pathMaker, direction, random);
    }
};

/**
 * Update the bugs
 * @param {WeatherState} weatherState The current weather state
 * @param {Random} random A randomizer
 */
Bugs.prototype.update = function(weatherState, random) {
    const bugCount = this.bugs.length;
    const bug = this.spawner.update(this.gl, weatherState, this.pathMaker, bugCount, random);

    if (bug)
        this.bugs.push(bug);

    for (let bug = bugCount; bug-- > 0;) {
        if (this.bugs[bug].update(
            this.pathMaker,
            this.constellation.width,
            this.constellation.height,
            weatherState,
            random)) {
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
    if (this.bugs)
        for (const bug of this.bugs)
            bug.free();
};