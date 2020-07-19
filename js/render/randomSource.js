/**
 * A texture source for random values
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Random} random A randomizer
 * @constructor
 */
const RandomSource = function(gl, random) {
    this.gl = gl;
    this.texture = this.createTexture(random);
};

RandomSource.prototype.SIZE = 256;

/**
 * Create the random texture
 * @param {Random} random A randomizer
 */
RandomSource.prototype.createTexture = function(random) {
    const texture = this.gl.createTexture();
    const numbers = new Array(this.SIZE * this.SIZE);

    for (let i = 0; i < numbers.length; ++i)
        numbers[i] = Math.floor(256 * random.getFloat());

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        this.SIZE,
        this.SIZE,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        new Uint8Array(numbers));

    return texture;
};

/**
 * Free this random source
 */
RandomSource.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};