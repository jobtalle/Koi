/**
 * Plants
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Slots} slots The slots to place objects on
 * @param {HiddenSlots} hiddenSlots The hidden slots
 * @param {Biome} biome The biome
 * @param {Random} random A randomizer
 * @constructor
 */
const Plants = function(
    gl,
    constellation,
    slots,
    hiddenSlots,
    biome,
    random) {
    const vertices = [];
    const indices = [];

    this.plantMap = new PlantMap(constellation.width, constellation.height, Slots.prototype.RADIUS * 2);

    const planter = new Planter(slots, hiddenSlots, biome, this.plantMap, random)

    this.bugSpots = planter.plant(this, vertices, indices);
    this.mesh = this.makeMesh(gl, vertices, indices, constellation);
};

Plants.prototype.STRIDE = 10;
Plants.prototype.WIND_UV_RADIUS = .6;

/**
 * Make the vegetation mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number[]} vertices All plant vertices
 * @param {Number[]} indices All plant indices
 * @param {Constellation} constellation The constellation
 * @returns {Mesh} The plant mesh
 */
Plants.prototype.makeMesh = function(
    gl,
    vertices,
    indices,
    constellation) {
    new MeshNormalizer(
        constellation.width,
        constellation.height,
        this.STRIDE,
        [3],
        [4],
        [6],
        [5, 7],
        [8],
        [9]).apply(vertices);

    return new Mesh(gl, new MeshData(vertices, indices), this.getFirstIndex(vertices) - 1 > 0xFFFF ? 4 : 2);
};

/**
 * Get the first index of a new mesh in the vertex array
 * @param {Number[]} vertices The vertex array
 * @returns {Number} The first index of vertices that will be added to the array
 */
Plants.prototype.getFirstIndex = function(vertices) {
    return vertices.length / this.STRIDE;
};

/**
 * Make a frequency map UV with some offset
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Random} random A randomizer
 * @returns {Vector2} The UV coordinates
 */
Plants.prototype.makeUV = function(x, y, random) {
    const angle = random.getFloat() * Math.PI * 2;
    const radius = Math.sqrt(random.getFloat()) * this.WIND_UV_RADIUS;

    return new Vector2(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius);
};

/**
 * Free all resources maintained by plants
 */
Plants.prototype.free = function() {
    this.mesh.free();
};