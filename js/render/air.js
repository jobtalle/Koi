/**
 * An air plane to render wind on
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Random} random A randomizer
 * @constructor
 */
const Air = function(gl, width, height, random) {
    ConvolutionalBuffer.call(this, gl, width, height, this.SCALE, new Color(.5, 0, 0, .5), gl.RGBA);

    this.gl = gl;
    this.springs = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.springs);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        this.width,
        this.height,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        new Uint8Array(this.createSpringValues(this.width * this.height, random)));
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
};

Air.prototype = Object.create(ConvolutionalBuffer.prototype);
Air.prototype.SCALE = 4;
Air.prototype.SPRING_MIN = .18;
Air.prototype.SPRING_MAX = .38;

/**
 * Add displacement to the air
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} radius The displacement radius
 * @param {Number} amount The amount of displacement in the range [-1, 1]
 */
Air.prototype.addDisplacement = function(x, y, radius, amount) {
    if (amount > 0)
        this.influences.addFlare(x, y, radius, 0, 0, amount);
    else
        this.influences.addFlare(x, y, radius, 0, -amount, 0);
};

/**
 * Create spring values for the wind shader
 * @param {Number} count The number of spring values
 * @param {Random} random A randomizer
 * @returns {Number[]} The spring values
 */
Air.prototype.createSpringValues = function(count, random) {
    const springs = new Array(count);

    for (let i = 0; i < count; ++i)
        springs[i] = Math.floor(256 * (this.SPRING_MIN + (this.SPRING_MAX - this.SPRING_MIN) * random.getFloat()));

    return springs;
};

/**
 * Free all resources
 */
Air.prototype.free = function() {
    ConvolutionalBuffer.prototype.free.call(this);

    this.gl.deleteTexture(this.springs);
};