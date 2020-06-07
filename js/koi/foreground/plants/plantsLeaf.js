/**
 * A set of leaves to place on a stalk
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Z origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} density The amounts of leaves per distance
 * @param {Number} minAngle The minimum branching angle
 * @param {Number} maxAngle The maximum branching angle
 * @param {Number} lengthRoot The leaf length at the root
 * @param {Number} lengthTip The leaf length at the tip
 * @param {Number} width The leaf width factor
 * @param {Number} flex The flex amount
 * @param {Random} random A randomizer
 * @constructor
 */
Plants.LeafSet = function(
    x1,
    z1,
    x2,
    z2,
    density,
    minAngle,
    maxAngle,
    lengthRoot,
    lengthTip,
    width,
    flex,
    random) {
    this.x1 = x1;
    this.z1 = z1;
    this.dx = x2 - x1;
    this.dz = z2 - z1;
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;
    this.lengthRoot = lengthRoot;
    this.lengthTip = lengthTip;
    this.width = width;
    this.flex = flex;

    const distance = Math.sqrt(this.dx * this.dx + this.dz * this.dz);

    this.leaves = new Array(Math.round(distance / density));

    for (let leaf = 0; leaf < this.leaves.length; ++leaf)
        this.leaves[leaf] = random.getFloat() * distance;

    this.leaves.sort((a, b) => a - b);
};

/**
 * Model the leaves in this set
 * @param {Number} y The Y position
 * @param {Vector2} uv The air UV
 * @param {Plants} plants The plants object
 * @param {Plants.FlexSampler} flexSampler A flex sampler
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.LeafSet.prototype.model = function(
    y,
    uv,
    plants,
    flexSampler,
    random,
    vertices,
    indices) {
    let angleDirection = random.getFloat() < .5 ? -1 : 1;

    for (const distance of this.leaves) {
        const x = this.x1 + this.dx * distance;
        const z = this.z1 + this.dz * distance;
        const flexVector = flexSampler.sample(x, z);
        const length = this.lengthRoot + (this.lengthTip - this.lengthRoot) * distance;
        const angle = Math.PI * .5 + angleDirection *
            (this.minAngle + (this.maxAngle - this.minAngle) * random.getFloat());

        angleDirection = -angleDirection;

        plants.modelLeaf(
            flexVector,
            x,
            z,
            x + Math.cos(angle) * length,
            z + Math.sin(angle) * length,
            y,
            this.width,
            this.flex * (random.getFloat() * 2 - 2),
            plants.makeUV(x, y, random),
            vertices,
            indices);
    }
};

Plants.prototype.LEAF_RESOLUTION = .15;
Plants.prototype.LEAF_SEGMENTS_MIN = 5;
Plants.prototype.LEAF_BULGE = .5;
Plants.prototype.LEAF_SHADE = .8;

Plants.prototype.COLOR_LEAF = Color.fromCSS("leaf"); // TODO: Should be parameter instead

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
        flex,
        firstIndex,
        firstIndex + ((segments - 1) << 2) - 1,
        x1,
        z1,
        vertices);
};