/**
 * A shore system which keeps track of the distance to the nearest shore
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Stone} stone The stone renderer
 * @param {Ponds} ponds The ponds renderer
 * @param {DistanceField} distanceField The distance field renderer
 * @constructor
 */
const Shore = function(
    gl,
    width,
    height,
    stone,
    ponds,
    distanceField) {
    this.gl = gl;
    this.texture = this.makeTexture(width, height, stone, ponds, distanceField);
};

Shore.prototype.SCALE = 32;

/**
 * Make the shore distance texture
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Stone} stone The stone renderer
 * @param {Ponds} ponds The ponds renderer
 * @param {DistanceField} distanceField The distance field renderer
 */
Shore.prototype.makeTexture = function(
    width,
    height,
    stone,
    ponds,
    distanceField) {
    const widthPixels = Math.ceil(width * this.SCALE);
    const heightPixels = Math.ceil(height * this.SCALE);
    const renderTarget = new RenderTarget(
        this.gl,
        widthPixels,
        heightPixels,
        this.gl.RGBA,
        false,
        this.gl.LINEAR);

    renderTarget.target();

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    ponds.renderShape();
    stone.renderBase();

    const distance = distanceField.make(renderTarget.texture, widthPixels, heightPixels);

    renderTarget.free();

    return distance;
};

/**
 * Free all resources maintained by the shore system
 */
Shore.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};