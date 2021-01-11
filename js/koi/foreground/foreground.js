/**
 * The scene foreground
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 * @constructor
 */
const Foreground = function(
    gl,
    constellation,
    random) {
    const slots = new Slots(
        this.X_PADDING,
        this.Y_SHIFT,
        constellation.width - 2 * this.X_PADDING,
        constellation.height + this.Y_OVERFLOW - this.Y_SHIFT,
        constellation,
        random);
    const biome = new Biome(constellation, slots.width, slots.height, random);

    this.gl = gl;
    this.rocks = new Rocks(gl, constellation, slots, this.Y_SCALE, biome, random);
    this.plants = new Plants(gl, constellation, slots, biome, random);
    this.bugs = new Bugs(gl, constellation, biome, this.plants.bugSpots);
};

Foreground.prototype.Y_SCALE = .74;
Foreground.prototype.X_PADDING = .05;
Foreground.prototype.Y_SHIFT = .2;
Foreground.prototype.Y_OVERFLOW = .3;

/**
 * Displace things
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} dx The X direction
 * @param {Number} dy The Y direction
 * @param {Number} radius The displacement radius
 * @param {Random} random A randomizer
 */
Foreground.prototype.displace = function(x, y, dx, dy, radius, random) {
    this.bugs.displace(x, y, Math.atan2(dy, dx), radius, random);
};

/**
 * Update the foreground
 * @param {WeatherState} weatherState The current weather state
 * @param {Random} random A randomizer
 */
Foreground.prototype.update = function(weatherState, random) {
    this.bugs.update(weatherState, random);
};

/**
 * Render foreground graphics
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Stone} stone The stone renderer
 * @param {Flying} flying The flying animal renderer
 * @param {Air} air An air object
 * @param {Number} time The time interpolation factor
 */
Foreground.prototype.render = function(
    vegetation,
    stone,
    flying,
    air,
    time) {
    stone.render();
    vegetation.render(air, time);

    this.bugs.render(flying, air, time);
};

/**
 * Free all resources maintained by the foreground
 */
Foreground.prototype.free = function() {
    this.plants.free();
    this.rocks.free();
    this.bugs.free();
};