/**
 * A set of leaves to place on a stalk
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Z origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} distributionPower The distribution power
 * @param {Number} density The amounts of leaves per distance
 * @param {Number} minAngle The minimum branching angle
 * @param {Number} maxAngle The maximum branching angle
 * @param {Number} lengthRoot The leaf length at the root
 * @param {Number} lengthTip The leaf length at the tip
 * @param {Number} width The leaf width factor
 * @param {Number} flexMin The minimum flex amount
 * @param {Number} flexMax The maximum flex amount
 * @param {Random} random A randomizer
 * @constructor
 */
const LeafSet = function(
    x1,
    z1,
    x2,
    z2,
    distributionPower,
    density,
    minAngle,
    maxAngle,
    lengthRoot,
    lengthTip,
    width,
    flexMin,
    flexMax,
    random) {
    this.x1 = x1;
    this.z1 = z1;
    this.dx = x2 - x1;
    this.dz = z2 - z1;
    this.direction = Math.atan2(this.dz, this.dx);
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;
    this.lengthRoot = lengthRoot;
    this.lengthTip = lengthTip;
    this.width = width;
    this.flexMin = flexMin;
    this.flexMax = flexMax;

    const distance = Math.sqrt(this.dx * this.dx + this.dz * this.dz);
    const leafCount = Math.round(distance / density);
    const leafSpacing = 1 / leafCount;

    this.leaves = new Array(leafCount);

    for (let leaf = 0; leaf < leafCount; ++leaf)
        this.leaves[leaf] = Math.pow(
            (leaf + random.getFloat() * (1 - this.MIN_PADDING)) * leafSpacing,
            distributionPower);

    this.leaves.sort((a, b) => b - a);
};

LeafSet.prototype.MIN_PADDING = .2;

/**
 * Model the leaves in this set
 * @param {Number} y The Y position
 * @param {Vector2} uv The air UV
 * @param {Color} color The leaf color
 * @param {Plants} plants The plants object
 * @param {FlexSampler} flexSampler A flex sampler
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
LeafSet.prototype.model = function(
    y,
    uv,
    color,
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
        const angle = this.direction + angleDirection *
            (this.minAngle + (this.maxAngle - this.minAngle) * random.getFloat());
        const flex = this.flexMin + (this.flexMax - this.flexMin) * random.getFloat();
        const flexDirection = random.getFloat() < .5 ? -1 : 1;

        angleDirection = -angleDirection;

        plants.modelLeaf(
            flexVector,
            x,
            z,
            x + Math.cos(angle) * length,
            z + Math.sin(angle) * length,
            y,
            this.width,
            flex * flexDirection,
            uv,
            color,
            vertices,
            indices);
    }
};