/**
 * The fish pattern atlas, containing all fish patterns
 * @param {Renderer} renderer The renderer
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 * @constructor
 */
const Atlas = function(renderer, capacity) {
    this.renderer = renderer;
    this.width = 0;
    this.height = 0;
    this.slotWidth = 0;
    this.slotHeight = 0;
    this.available = null;
    this.framebuffer = renderer.gl.createFramebuffer();
    this.texture = this.createTexture(renderer.gl, capacity);
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
                (x * this.WIDTH_RATIO * this.RESOLUTION) / this.width,
                ((y * this.WIDTH_RATIO + row) * this.RESOLUTION) / this.height)) === capacity)
                return available;

    return available;
};

/**
 * Create the atlas texture
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Number} capacity The number of fish patterns this atlas must be able to contain
 */
Atlas.prototype.createTexture = function(gl, capacity) {
    const texture = gl.createTexture();
    const blocks = Math.ceil(capacity / this.WIDTH_RATIO);
    const blockResolution = Math.ceil(Math.sqrt(blocks));

    this.width = this.height = this.nearestPow2(blockResolution * this.RESOLUTION * this.WIDTH_RATIO);
    this.slotWidth = this.RESOLUTION * this.WIDTH_RATIO / this.width;
    this.slotHeight = this.RESOLUTION / this.height;
    this.available = this.createSlots(blockResolution, capacity);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        this.width,
        this.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    return texture;
};

/**
 * Get an atlas slot to write to
 * @returns {Vector} The origin of the atlas slot
 */
Atlas.prototype.getSlot = function() {
    return this.available.pop();
};

/**
 * Return an atlas slot that is no longer being used
 * @param {Vector} slot The origin of the atlas slot
 */
Atlas.prototype.returnSlot = function(slot) {
    this.available.push(slot);
};

/**
 * Write a texture to the atlas
 * @param {Pattern} pattern The pattern to write to the atlas
 */
Atlas.prototype.write = function(pattern) {
    console.log("Writing to " + pattern.slot.x + ", " + pattern.slot.y);
};

/**
 * Free all resources maintained by the atlas
 */
Atlas.prototype.free = function() {
    this.renderer.gl.deleteFramebuffer(this.framebuffer);
    this.renderer.gl.deleteTexture(this.texture);
};