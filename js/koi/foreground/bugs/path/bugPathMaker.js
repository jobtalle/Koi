/**
 * A bug path maker
 * @param {Constellation} constellation The constellation
 * @param {Biome} biome The biome
 * @param {BugSpot[]} bugSpots Bug spots
 * @constructor
 */
const BugPathMaker = function(constellation, biome, bugSpots) {
    this.constellation = constellation;
    this.biome = biome;
    this.bugSpots = bugSpots; // TODO: Exclude bug spots too close to the view edge
};

BugPathMaker.prototype.EDGE_PADDING = 1.2;
BugPathMaker.prototype.CONE_ANGLE = Math.PI * .25;
BugPathMaker.prototype.CONE_STEP = 2;
BugPathMaker.prototype.CONE_DENSITY = 4;

/**
 * Get a random bug spot from the pool
 * @param {Random} random A randomizer
 * @returns {BugSpot} A bug spot, or null if no bug spots are available
 */
BugPathMaker.prototype.getSpot = function(random) {
    if (this.bugSpots.length === 0)
        return null;

    return this.bugSpots.splice(Math.floor(this.bugSpots.length * random.getFloat()), 1)[0];
};

/**
 * Return a bug spot to the pool
 * @param {BugSpot} spot The bug spot to return
 */
BugPathMaker.prototype.returnSpot = function(spot) {
    this.bugSpots.push(spot);
};

/**
 * Get a vector pointing towards the closest scene edge
 * @param {Vector2} position The position to create an exit vector for
 * @returns {Vector2} A unit vector pointing towards the closest edge
 */
BugPathMaker.prototype.getExitVector = function(position) {
    const nx = position.x / this.constellation.width;
    const ny = position.y / this.constellation.height;
    // TODO: Randomize exit vector within the entire cone
    if (nx > ny) {
        if (1 - ny > nx)
            return new Vector2(0, -1);
        else
            return new Vector2(1, 0);
    }
    else {
        if (1 - ny > nx)
            return new Vector2(-1, 0);
        else
            return new Vector2(0, 1);
    }
};

/**
 * Recycle the occupied nodes in a previously created path
 * @param {BugPath} path The path to recycle
 */
BugPathMaker.prototype.recycle = function(path) {
    for (const node of path.nodes) if (node.spot)
        this.returnSpot(node.spot);
};

/**
 * Trace a path in the direction of a cone
 * @param {Vector2} origin The cone origin
 * @param {Vector2} direction The cone direction
 * @param {Random} random A randomizer
 * @param {Boolean} [stopAtSpot] True if the path should end at the next found bug spot
 * @returns {BugPathNode[]} The nodes in the path
 */
BugPathMaker.prototype.trace = function(origin, direction, random, stopAtSpot = false) {
    const nodes = [];
    const angle = direction.angle();

    for (let radius = this.CONE_STEP;; radius += this.CONE_STEP) {
        const radiusNext = radius + this.CONE_STEP;
        const angleSampler = new Sampler(angle - this.CONE_ANGLE * .5, angle + this.CONE_ANGLE * .5);
        const area = -.5 * Math.PI * Math.PI * this.CONE_ANGLE * (radius * radius - radiusNext * radiusNext);
        const candidateCount = Math.ceil(area / this.CONE_DENSITY);
        let bestCandidate = null;
        let bestCandidatePriority = 0;

        for (let candidate = 0; candidate < candidateCount; ++candidate) {
            const r = Math.sqrt(2 * random.getFloat() / (2 / (radiusNext * radiusNext - radius * radius)) +
                radius * radius);
            const a = angleSampler.sample(random.getFloat());
            const candidate = new BugPathNode(new Vector3(
                origin.x + Math.cos(a) * r,
                origin.y + Math.sin(a) * r,
                1));
            const priority = candidate.getPriority(this.biome);

            if (!bestCandidate || bestCandidatePriority < priority) {
                bestCandidate = candidate;
                bestCandidatePriority = priority;
            }
        }

        nodes.push(bestCandidate);

        if (bestCandidate.position.x < -this.EDGE_PADDING ||
            bestCandidate.position.y < -this.EDGE_PADDING ||
            bestCandidate.position.x > this.constellation.width + this.EDGE_PADDING ||
            bestCandidate.position.y > this.constellation.height + this.EDGE_PADDING)
            break;
    }

    return nodes;
};

/**
 * Make an entrance path
 * @param {Random} random A randomizer
 * @returns {BugPath} A bug path to a spot starting outside the view, or null when no empty spots were available
 */
BugPathMaker.prototype.makeEntrance = function(random) {
    const target = this.getSpot(random);

    if (!target)
        return null;

    const origin = target.position.vector2();
    const exitVector = this.getExitVector(origin);

    return new BugPath([new BugPathNode(target.position, target), ...this.trace(origin, exitVector, random)].reverse());
};

BugPathMaker.prototype.makeWander = function(direction, random) {
    // TODO
};

BugPathMaker.prototype.makeLeave = function(random) {
    // TODO
};