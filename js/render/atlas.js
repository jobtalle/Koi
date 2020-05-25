/**
 * The fish pattern atlas, containing all fish patterns
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Patterns} patterns A pattern renderer
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 * @constructor
 */
const Atlas = function(gl, patterns, capacity) {
    this.gl = gl;
    this.patterns = patterns;
    this.slotSize = new Vector2();
    this.available = null;
    this.renderTarget = this.createRenderTarget(capacity);
};

Atlas.prototype.RESOLUTION = 64;
Atlas.prototype.RATIO = 4;

/**
 * Create all texture slots on the atlas
 * @param {Number} blockResolution The square root of the number of slot blocks on this atlas
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @returns {Vector2[]} The positions of all available texture slots
 */
Atlas.prototype.createSlots = function(blockResolution, width, height) {
    const available = [];

    for (let y = 0; y < blockResolution; ++y) for (let x = 0; x < blockResolution; ++x)
        for (let row = 0; row <= this.RATIO; ++row)
            available.push(new Vector2(
                (x * (this.RATIO + 1) * this.RESOLUTION) / width,
                ((y * (this.RATIO + 1) + row) * this.RESOLUTION) / height))

    return available;
};

/**
 * Create the atlas texture
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 */
Atlas.prototype.createRenderTarget = function(capacity) {
    const blocks = Math.ceil(capacity / (this.RATIO + 1));
    const blockResolution = Math.ceil(Math.sqrt(blocks));
    const size = blockResolution * this.RESOLUTION * (this.RATIO + 1);
    const renderTarget = new RenderTarget(this.gl, size, size, this.gl.RGBA, this.gl.LINEAR);

    this.slotSize.x = this.RESOLUTION * this.RATIO / size;
    this.slotSize.y = this.RESOLUTION / size;
    this.available = this.createSlots(blockResolution, size, size);

    return renderTarget;
};

/**
 * Get an atlas slot to write to
 * @returns {Vector2} The origin of the atlas slot
 */
Atlas.prototype.getSlot = function() {
    return this.available.pop();
};

/**
 * Return an atlas region that is no longer being used
 * @param {AtlasRegion} region The atlas region
 */
Atlas.prototype.returnRegion = function(region) {
    this.available.unshift(region.slot);
};

/**
 * Write a texture to the atlas
 * @param {Pattern} pattern The pattern to write to the atlas
 */
Atlas.prototype.write = function(pattern) {
    pattern.region = new AtlasRegion(this.getSlot(), this.slotSize);

    this.renderTarget.target();
    this.patterns.write(pattern, pattern.region, 1 / this.renderTarget.width);
};

/**
 * Free all resources maintained by the atlas
 */
Atlas.prototype.free = function() {
    this.renderTarget.free();
};