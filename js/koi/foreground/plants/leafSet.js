/**
 * A set of leaves to place on a stalk
 * @param {Path2Sampler} pathSampler The path to place leaves on
 * @param {Sampler} placementSampler A sampler for leaf positions along the path
 * @param {Number} density The amounts of leaves per distance
 * @param {Sampler} angleSampler The angle offset sampler
 * @param {Sampler} lengthSampler The leaf length sampler
 * @param {Number} width The leaf width factor
 * @param {Sampler} flexSampler The flex amount sampler
 * @param {Random} random A randomizer
 * @constructor
 */
const LeafSet = function(
    pathSampler,
    placementSampler,
    density,
    angleSampler,
    lengthSampler,
    width,
    flexSampler,
    random) {
    this.pathSampler = pathSampler;
    this.angleSampler = angleSampler;
    this.lengthSampler = lengthSampler;
    this.width = width;
    this.flexSampler = flexSampler;

    const leafCount = Math.round(pathSampler.getLength() * placementSampler.getDomain() / density);

    this.leaves = new Array(leafCount);

    for (let leaf = 0; leaf < leafCount; ++leaf)
        this.leaves[leaf] = placementSampler.sample((leaf + random.getFloat() * (1 - this.MIN_PADDING)) / leafCount);

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
    const sample = new Vector2();
    const direction = new Vector2();
    let angleDirection = random.getFloat() < .5 ? -1 : 1;

    for (const distance of this.leaves) {
        this.pathSampler.sample(sample, distance * this.pathSampler.getLength());
        this.pathSampler.sampleDirection(direction, distance * this.pathSampler.getLength());

        const flexVector = flexSampler.sample(sample.x, sample.y);
        const length = this.lengthSampler.sample(distance);
        const angle = direction.angle() + angleDirection * this.angleSampler.sample(random.getFloat());
        const flex = this.flexSampler.sample(random.getFloat());
        const flexDirection = random.getFloat() < .5 ? -1 : 1;

        angleDirection = -angleDirection;

        plants.modelLeaf(
            flexVector,
            sample.x,
            sample.y,
            sample.x + Math.cos(angle) * length,
            sample.y + Math.sin(angle) * length,
            y,
            this.width,
            flex * flexDirection,
            uv,
            color,
            vertices,
            indices);
    }
};