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
    const slots = new Slots(constellation.width, constellation.height + this.Y_OVERFLOW, constellation, random);
    const biome = new Biome(constellation, slots.width, slots.height, random);

    this.gl = gl;
    this.rocks = new Rocks(gl, constellation, slots, this.Y_SCALE, biome, random);
    this.plants = new Plants(gl, constellation, slots, biome, random);
    this.bugs = new Bugs(gl, constellation);
};

Foreground.prototype.Y_SCALE = .74;
Foreground.prototype.Y_OVERFLOW = .3;

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