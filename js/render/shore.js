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

Shore.prototype.SCALE = Reflections.prototype.SCALE;
Shore.prototype.WIDTH = .24;
Shore.prototype.COLOR_SHAPE_PONDS = new Color(1, 1, 1, 1);
Shore.prototype.COLOR_SHAPE_ROCKS = new Color(0, 0, 0, 0);

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

    ponds.renderShape(this.COLOR_SHAPE_PONDS);
    stone.renderBase(this.COLOR_SHAPE_ROCKS);

    const distance = distanceField.make(
        renderTarget.texture,
        widthPixels,
        heightPixels,
        Math.round(this.SCALE * this.WIDTH));

    renderTarget.free();

    return distance;
};

/**
 * Free all resources maintained by the shore system
 */
Shore.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};