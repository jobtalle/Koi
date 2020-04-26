/**
 * The fish pattern atlas, containing all fish patterns
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 * @constructor
 */
const Atlas = function(gl, capacity) {
    this.gl = gl;
    this.width = 0;
    this.height = 0;
    this.available = null;
    this.occupied = [];
    this.framebuffer = gl.createFramebuffer();
    this.texture = this.createTexture(capacity);
};

Atlas.prototype.RESOLUTION = 32;
Atlas.prototype.WIDTH_RATIO = 4;

/**
 * Find the nearest power of 2 which is bigger than or equal to a number
 * @param {Number} number A number
 * @returns {Number} The biggest power of 2 larger than that number
 */
Atlas.prototype.nearestPow2 = function(number) {
    let n = 1;

    while (n < number)
        n <<= 1;

    return n;
};

/**
 * Create all texture slots on the atlas
 * @param {Number} blockResolution The square root of the number of slot blocks on this atlas
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 * @returns {Vector[]} The positions of all texture slots
 */
Atlas.prototype.createSlots = function(blockResolution, capacity) {
    const available = [];

    for (let y = 0; y < blockResolution; ++y) for (let x = 0; x < blockResolution; ++x)
        for (let row = 0; row < this.WIDTH_RATIO; ++row)
            if (available.push(new Vector(
                x * this.WIDTH_RATIO * this.RESOLUTION,
                (y * this.WIDTH_RATIO + row) * this.RESOLUTION)) === capacity)
                return available;

    return available;
};

/**
 * Create the atlas texture
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 */
Atlas.prototype.createTexture = function(capacity) {
    const texture = this.gl.createTexture();
    const blocks = Math.ceil(capacity / this.WIDTH_RATIO);
    const blockResolution = Math.ceil(Math.sqrt(blocks));

    this.width = this.height = this.nearestPow2(blockResolution * this.RESOLUTION * this.WIDTH_RATIO);
    this.available = this.createSlots(blockResolution, capacity);

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.width,
        this.height,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        null);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    return texture;
};

/**
 * Free all resources maintained by the atlas
 */
Atlas.prototype.free = function() {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);
};