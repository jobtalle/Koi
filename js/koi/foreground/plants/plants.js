/**
 * Plants
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Slots} slots The slots to place objects on
 * @param {Biome} biome The biome
 * @param {Random} random A randomizer
 * @constructor
 */
const Plants = function(
    gl,
    constellation,
    slots,
    biome,
    random) {
    this.plantMap = new PlantMap(constellation.width, constellation.height, Slots.prototype.RESOLUTION);
    this.mesh = this.makeMesh(gl, constellation, new Planter(slots, biome, this.plantMap, random));
};

/**
 * A flex vector sampler
 * @param {Number} xOrigin The X origin
 * @param {Number} zOrigin The Z origin
 * @param {Number} flex The maximum amount of flex
 * @param {Number} power The flex amount power
 * @param {Number} length The maximum distance from the origin
 * @constructor
 */
Plants.FlexSampler = function(xOrigin, zOrigin, flex, power, length) {
    this.xOrigin = xOrigin;
    this.zOrigin = zOrigin;
    this.flex = flex;
    this.power = power;
    this.length = length;
}

/**
 * Sample a flex vector
 * @param {Number} x The vertex X position
 * @param {Number} z The vertex Z position
 * @returns {Vector2} The flex vector
 */
Plants.FlexSampler.prototype.sample = function(x, z) {
    const dx = x - this.xOrigin;
    const dz = z - this.zOrigin;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const f = dist / this.length;

    return new Vector2(
        dz * this.flex * Math.pow(f, this.power),
        dx * this.flex * Math.pow(f, this.power));
};

/**
 * Apply this sampler cumulatively to a range of vertices
 * @param {Number[]} vertices The vertex data array
 * @param {Number} start The start of the range
 * @param {Number} end The end of the range
 */
Plants.FlexSampler.prototype.applyToRange = function(vertices, start, end) {
    for (let i = start; i <= end; ++i) {
        const index = i * Plants.prototype.STRIDE;
        const flexVector = this.sample(vertices[index + 3], vertices[index + 5]);

        vertices[index + 6] += flexVector.x;
        vertices[index + 7] += flexVector.y;
    }
};

Plants.prototype.STRIDE = 10;
Plants.prototype.WIND_UV_RADIUS = .6;

/**
 * Make the vegetation mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Planter} planter A planter
 */
Plants.prototype.makeMesh = function(
    gl,
    constellation,
    planter) {
    const vertices = [];
    const indices = [];

    planter.plant(this, vertices, indices);

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

    return new Mesh(gl, new MeshData(vertices, indices), this.getFirstIndex(vertices) - 1 > 0xFFFF);
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
 * Make a flex vector that determines the direction in which a vegetation vertex bends
 * @param {Number} flex The amount of flex
 * @param {Number} x The X position of the vertex
 * @param {Number} z The Z position of the vertex
 * @param {Number} xOrigin The plant X origin
 * @param {Number} zOrigin The plant Z origin
 * @returns {Vector2} The flex vector
 */
Plants.prototype.makeFlexVector = function(
    flex,
    x,
    z,
    xOrigin,
    zOrigin) {
    const dx = x - xOrigin;
    const dz = z - zOrigin;

    if (dx === 0 && dz === 0)
        return new Vector2();

    return new Vector2(dz * flex, dx * flex);
};

/**
 * Make flex vectors for a range of vertices
 * @param {Number} flex The amount of flex
 * @param {Number} start The start index
 * @param {Number} end The end index
 * @param {Number} xOrigin The plant X origin
 * @param {Number} zOrigin The plant Z origin
 * @param {Number[]} vertices The vertex array
 */
Plants.prototype.makeFlexVectors = function(
    flex,
    start,
    end,
    xOrigin,
    zOrigin,
    vertices) {
    for (let i = start; i <= end; ++i) {
        const index = i * this.STRIDE;
        const flexVector = this.makeFlexVector(
            flex,
            vertices[index + 3],
            vertices[index + 5],
            xOrigin,
            zOrigin);

        vertices[index + 6] += flexVector.x;
        vertices[index + 7] += flexVector.y;
    }
};

/**
 * Free all resources maintained by plants
 */
Plants.prototype.free = function() {
    this.mesh.free();
};