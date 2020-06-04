/**
 * Plants
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Slots} slots The slots to place objects on
 * @param {Random} random A randomizer
 * @constructor
 */
const Plants = function(gl, constellation, slots, random) {
    this.mesh = this.makeMesh(gl, constellation, slots, random);
};

Plants.prototype.WIND_UV_RADIUS = .4;
Plants.prototype.BLADE_HEIGHT_MIN = .3;
Plants.prototype.BLADE_HEIGHT_MAX = .85;
Plants.prototype.BLADE_FLEXIBILITY_POWER = 3.5;
Plants.prototype.STALK_FLEXIBILITY_POWER = 2.5;
Plants.prototype.STALK_SHADE = .8;
Plants.prototype.COLOR_GRASS = Color.fromCSS("grass");
Plants.prototype.COLOR_STALK = Color.fromCSS("stalk");

/**
 * Make the vegetation mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Slots} slots The slots to place objects on
 * @param {Random} random A randomizer
 */
Plants.prototype.makeMesh = function(gl, constellation, slots, random) {
    const vertices = [];
    const indices = [];

    slots.sort();

    for (const slot of slots.slots) if (slot) {
        if (random.getFloat() < .01)
            this.modelCattail(slot.x, slot.y, vertices, indices, random);
        else
            this.modelBlade(slot.x, slot.y, vertices, indices, random);
    }

    return new Mesh(gl, vertices, indices, this.getFirstIndex(vertices) - 1 > 0xFFFF);
};

/**
 * Get the first index of a new mesh in the vertex array
 * @param {Number[]} vertices The vertex array
 * @returns {Number} The first index of vertices that will be added to the array
 */
Plants.prototype.getFirstIndex = function(vertices) {
    return vertices.length / 9;
};

/**
 * Make a wind map UV with some offset
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
 * Model a cattail
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Random} random The randomizer
 */
Plants.prototype.modelCattail = function(
    x,
    y,
    vertices,
    indices,
    random) {
    const uv = this.makeUV(x, y, random);

    this.modelStalk(x, y, 1.5, uv, vertices, indices);
};

/**
 * Model a cattail capsule
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} height The height
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelCapsule = function(
    x,
    y,
    height,
    vertices,
    indices) {

};

/**
 * Model a stalk to support something
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} height The stalk height
 * @param {Vector2} uv The air UV
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelStalk = function(
    x,
    y,
    height,
    uv,
    vertices,
    indices) {
    const firstIndex = this.getFirstIndex(vertices);
    const radius = .05;
    const steps = 5;

    for (let step = 0; step < steps; ++step) {
        const f = step / (steps - 1);
        const flexibility = Math.pow(f, this.STALK_FLEXIBILITY_POWER);

        vertices.push(
            this.COLOR_STALK.r * this.STALK_SHADE,
            this.COLOR_STALK.g * this.STALK_SHADE,
            this.COLOR_STALK.b * this.STALK_SHADE,
            x - radius * (1 - .5 * f),
            y,
            height * f,
            flexibility,
            uv.x,
            uv.y);
        vertices.push(
            this.COLOR_STALK.r,
            this.COLOR_STALK.g,
            this.COLOR_STALK.b,
            x + radius * (1 - .5 * f),
            y,
            height * f,
            flexibility,
            uv.x,
            uv.y);

        if (step !== steps - 1)
            indices.push(
                firstIndex + (step << 1),
                firstIndex + (step << 1) + 1,
                firstIndex + (step << 1) + 3,
                firstIndex + (step << 1) + 3,
                firstIndex + (step << 1) + 2,
                firstIndex + (step << 1));
    }
};

/**
 * Make a grass blade
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Random} random A randomizer
 */
Plants.prototype.modelBlade = function(x, y, vertices, indices, random) {
    const uv = this.makeUV(x, y, random);
    const firstIndex = this.getFirstIndex(vertices);
    const height = this.BLADE_HEIGHT_MIN + (this.BLADE_HEIGHT_MAX - this.BLADE_HEIGHT_MIN) * random.getFloat();
    const radius = .1;
    const steps = 4;
    const l = .8 + .2 * random.getFloat();

    for (let step = 0; step < steps - 1; ++step) {
        const f = step / (steps - 1);
        const r = radius * Math.pow(1 - f, .7);
        const flexibility = Math.pow(f, this.BLADE_FLEXIBILITY_POWER);

        vertices.push(
            this.COLOR_GRASS.r * l,
            this.COLOR_GRASS.g * l,
            this.COLOR_GRASS.b * l,
            x - r,
            y,
            height * f,
            flexibility,
            uv.x,
            uv.y);
        vertices.push(
            this.COLOR_GRASS.r * l,
            this.COLOR_GRASS.g * l,
            this.COLOR_GRASS.b * l,
            x + r,
            y,
            height * f,
            flexibility,
            uv.x,
            uv.y);

        if (step !== steps - 2)
            indices.push(
                firstIndex + (step << 1),
                firstIndex + (step << 1) + 1,
                firstIndex + (step << 1) + 3,
                firstIndex + (step << 1) + 3,
                firstIndex + (step << 1) + 2,
                firstIndex + (step << 1));
        else
            indices.push(
                firstIndex + (step << 1),
                firstIndex + (step << 1) + 1,
                firstIndex + (step << 1) + 2);
    }

    vertices.push(
        this.COLOR_GRASS.r * l,
        this.COLOR_GRASS.g * l,
        this.COLOR_GRASS.b * l,
        x,
        y,
        height,
        1,
        uv.x,
        uv.y);
};

/**
 * Free all resources maintained by plants
 */
Plants.prototype.free = function() {
    this.mesh.free();
};