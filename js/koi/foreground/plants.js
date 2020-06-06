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

Plants.prototype.STRIDE = 10;
Plants.prototype.WIND_UV_RADIUS = .45;

Plants.prototype.BLADE_HEIGHT_MIN = .3;
Plants.prototype.BLADE_HEIGHT_MAX = .85;
Plants.prototype.BLADE_FLEXIBILITY_POWER = 3.5;

Plants.prototype.STALK_RESOLUTION = .3;
Plants.prototype.STALK_SHADE = .8;

Plants.prototype.LEAF_RESOLUTION = .15;
Plants.prototype.LEAF_SEGMENTS_MIN = 5;
Plants.prototype.LEAF_BULGE = .25;
Plants.prototype.LEAF_SHADE = .8;

Plants.prototype.COLOR_GRASS = Color.fromCSS("grass");
Plants.prototype.COLOR_LEAF = Color.fromCSS("leaf");
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
            this.modelGrass(slot.x, slot.y, vertices, indices, random);
    }

    return new Mesh(gl, vertices, indices, this.getFirstIndex(vertices) - 1 > 0xFFFF);
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
 * Make a grass blade
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Random} random A randomizer
 */
Plants.prototype.modelGrass = function(
    x,
    y,
    vertices,
    indices,
    random) {
    const uv = this.makeUV(x, y, random);
    const height = this.BLADE_HEIGHT_MIN + (this.BLADE_HEIGHT_MAX - this.BLADE_HEIGHT_MIN) * random.getFloat();

    this.modelStalk(
        x,
        0,
        x,
        height,
        y,
        .1,
        uv,
        this.COLOR_GRASS.copy().multiply(.85 + .15 * random.getFloat()),
        .95,
        .3,
        this.BLADE_FLEXIBILITY_POWER,
        vertices,
        indices);
    this.modelStalk(
        x,
        0,
        x - .16,
        height,
        y,
        .1,
        uv,
        this.COLOR_GRASS.copy().multiply(.85 + .15 * random.getFloat()),
        .95,
        .3,
        this.BLADE_FLEXIBILITY_POWER,
        vertices,
        indices);
    this.modelStalk(
        x,
        0,
        x + .16,
        height,
        y,
        .1,
        uv,
        this.COLOR_GRASS.copy().multiply(.85 + .15 * random.getFloat()),
        .95,
        .3,
        this.BLADE_FLEXIBILITY_POWER,
        vertices,
        indices);
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

    this.modelStalk(
        x,
        0,
        x,
        1.5,
        y,
        .05,
        uv,
        this.COLOR_STALK,
        .8,
        .2,
        2.5,
        vertices,
        indices);
};

/**
 * Model a leaf
 * @param {Vector2} flexVector The flex vector at the root of this leaf
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Z origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} y The Y position
 * @param {Number} width The leaf width factor, proportional to length
 * @param {Number} flex The flexibility
 * @param {Vector2} uv The air UV
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Random} random A randomizer
 */
Plants.prototype.modelLeaf = function(
    flexVector,
    x1,
    z1,
    x2,
    z2,
    y,
    width,
    flex,
    uv,
    random,
    vertices,
    indices) {
    const firstIndex = this.getFirstIndex(vertices);
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dz * dz);
    const dxn = dx / length;
    const dzn = dz / length;
    const segments = Math.max(this.LEAF_SEGMENTS_MIN, Math.round(length / this.LEAF_RESOLUTION) + 1);

    const shadeLeft = dxn < 0 ? this.LEAF_SHADE : 1;
    const shadeRight = dxn < 0 ? 1 : this.LEAF_SHADE;
    const centerOffset = (dxn < 0 ? this.LEAF_BULGE : -this.LEAF_BULGE) * (1 - Math.abs(dzn));

    vertices.push(
        this.COLOR_LEAF.r * shadeLeft,
        this.COLOR_LEAF.g * shadeLeft,
        this.COLOR_LEAF.b * shadeLeft,
        x1,
        y,
        z1,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y,
        this.COLOR_LEAF.r * shadeRight,
        this.COLOR_LEAF.g * shadeRight,
        this.COLOR_LEAF.b * shadeRight,
        x1,
        y,
        z1,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y);

    indices.push(
        firstIndex,
        firstIndex + 2,
        firstIndex + 3,
        firstIndex + 1,
        firstIndex + 4,
        firstIndex + 5);

    for (let segment = 1; segment < segments - 1; ++segment) {
        const f = segment / (segments - 1);
        const radius = length * width * .5 * Math.cos(Math.PI * (f - .5));

        vertices.push(
            this.COLOR_LEAF.r * shadeLeft,
            this.COLOR_LEAF.g * shadeLeft,
            this.COLOR_LEAF.b * shadeLeft,
            x1 + dx * f + dzn * radius * centerOffset,
            y,
            z1 + dz * f - dxn * radius * centerOffset,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y,
            this.COLOR_LEAF.r * shadeRight,
            this.COLOR_LEAF.g * shadeRight,
            this.COLOR_LEAF.b * shadeRight,
            x1 + dx * f + dzn * radius,
            y,
            z1 + dz * f - dxn * radius,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);

        vertices.push(
            this.COLOR_LEAF.r * shadeRight,
            this.COLOR_LEAF.g * shadeRight,
            this.COLOR_LEAF.b * shadeRight,
            x1 + dx * f + dzn * radius * centerOffset,
            y,
            z1 + dz * f - dxn * radius * centerOffset,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y,
            this.COLOR_LEAF.r * shadeLeft,
            this.COLOR_LEAF.g * shadeLeft,
            this.COLOR_LEAF.b * shadeLeft,
            x1 + dx * f - dzn * radius,
            y,
            z1 + dz * f + dxn * radius,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);

        if (segment !== segments - 2)
            indices.push(
                firstIndex + (segment << 2) - 2,
                firstIndex + (segment << 2) - 1,
                firstIndex + (segment << 2) + 3,
                firstIndex + (segment << 2) + 3,
                firstIndex + (segment << 2) + 2,
                firstIndex + (segment << 2) - 2,
                firstIndex + (segment << 2),
                firstIndex + (segment << 2) + 1,
                firstIndex + (segment << 2) + 5,
                firstIndex + (segment << 2) + 5,
                firstIndex + (segment << 2) + 4,
                firstIndex + (segment << 2));
        else
            indices.push(
                firstIndex + (segment << 2) - 2,
                firstIndex + (segment << 2) - 1,
                firstIndex + (segment << 2) + 2,
                firstIndex + (segment << 2),
                firstIndex + (segment << 2) + 1,
                firstIndex + (segment << 2) + 3);
    }

    vertices.push(
        this.COLOR_LEAF.r * shadeLeft,
        this.COLOR_LEAF.g * shadeLeft,
        this.COLOR_LEAF.b * shadeLeft,
        x2,
        y,
        z2,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y,
        this.COLOR_LEAF.r * shadeRight,
        this.COLOR_LEAF.g * shadeRight,
        this.COLOR_LEAF.b * shadeRight,
        x2,
        y,
        z2,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y);

    this.makeFlexVectors(
        -1 + 2 * random.getFloat(),
        firstIndex,
        firstIndex + ((segments - 1) << 2) - 1,
        x1,
        z1,
        vertices);
};

/**
 * Model a stalk
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Y origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} y The Y position
 * @param {Number} radius The stalk radius
 * @param {Vector2} uv The air UV
 * @param {Color} color The color
 * @param {Number} shade The dark side shade
 * @param {Number} flex The amount of flex
 * @param {Number} flexPower The flex power
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelStalk = function(
    x1,
    z1,
    x2,
    z2,
    y,
    radius,
    uv,
    color,
    shade,
    flex,
    flexPower,
    vertices,
    indices) {
    const firstIndex = this.getFirstIndex(vertices);
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dz * dz);
    const segments = Math.max(2, Math.round(length / this.STALK_RESOLUTION) + 1);

    for (let segment = 0; segment < segments - 1; ++segment) {
        const f = segment / (segments - 1);
        const x = x1 + dx * f;
        const z = z1 + dz * f;
        const flexVector = this.makeFlexVector(
            flex * Math.pow(f, flexPower),
            x,
            z,
            x1,
            z1);

        vertices.push(
            color.r * shade,
            color.g * shade,
            color.b * shade,
            x - radius * (1 - f),
            y,
            z,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);
        vertices.push(
            color.r,
            color.g,
            color.b,
            x + radius * (1 - f),
            y,
            z,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);

        if (segment !== segments - 2)
            indices.push(
                firstIndex + (segment << 1),
                firstIndex + (segment << 1) + 1,
                firstIndex + (segment << 1) + 3,
                firstIndex + (segment << 1) + 3,
                firstIndex + (segment << 1) + 2,
                firstIndex + (segment << 1));
        else
            indices.push(
                firstIndex + (segment << 1),
                firstIndex + (segment << 1) + 1,
                firstIndex + (segment << 1) + 2);
    }

    const flexVector = this.makeFlexVector(
        flex,
        x2,
        z2,
        x1,
        z1);

    vertices.push(
        color.r * (1 - (1 - shade) * .5),
        color.g * (1 - (1 - shade) * .5),
        color.b * (1 - (1 - shade) * .5),
        x2,
        y,
        z2,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y);

    // Debug leaves
    // for (let i = 0; i < 3; ++i) {
    //     const h = height * random.getFloat();
    //     const angle = Math.PI * 2 * random.getFloat();
    //     const length = .4 + .25 * random.getFloat();
    //
    //     this.modelLeaf(
    //         this.makeFlexVector(
    //             flex * Math.pow(h / height, flexPower),
    //             x,
    //             h,
    //             x,
    //             0),
    //         x,
    //         h,
    //         x + Math.cos(angle) * length,
    //         h + Math.sin(angle) * length,
    //         y,
    //         .7,
    //         flex * Math.pow(h / height, flexPower),
    //         uv,
    //         vertices,
    //         indices);
    // }
};

/**
 * Free all resources maintained by plants
 */
Plants.prototype.free = function() {
    this.mesh.free();
};