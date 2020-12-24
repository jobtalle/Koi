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
    this.bugSpots = bugSpots;
};

BugPathMaker.prototype.EDGE_PADDING = 1.2;
BugPathMaker.prototype.EDGE_PADDING_Z = 2;
BugPathMaker.prototype.CONE_ANGLE = 1;
BugPathMaker.prototype.CONE_STEP = 1.3;
BugPathMaker.prototype.CONE_DENSITY = 4.5;
BugPathMaker.prototype.APPROACH_DISTANCE = new SamplerPower(.2, .5, 1.7);
BugPathMaker.prototype.APPROACH_ANGLE = new Sampler(Math.PI * .35, Math.PI * .65);
BugPathMaker.prototype.APPROACH_ALTITUDE = .75;
BugPathMaker.prototype.HOP_RADIUS = BugPathMaker.prototype.CONE_STEP;
BugPathMaker.prototype.ALTITUDE = .6;

/**
 * Get a random bug spot from the pool
 * @param {Random} random A randomizer
 * @returns {BugSpot} A bug spot, or null if no bug spots are available
 */
BugPathMaker.prototype.getSpot = function(random) {
    if (this.bugSpots.length === 0)
        return null;

    return this.occupySpot(this.bugSpots[Math.floor(this.bugSpots.length * random.getFloat())]);
};

/**
 * Mark a spot as occupied, removing it from the spots that may be used
 * @param {BugSpot} spot The spot
 * @returns {BugSpot} The spot that was occupied
 */
BugPathMaker.prototype.occupySpot = function(spot) {
    return this.bugSpots.splice(this.bugSpots.indexOf(spot), 1)[0];
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
    return position.copy().subtract(
        new Vector2(this.constellation.width, this.constellation.height).multiply(.5)).normalize();
};

/**
 * Get a path node that can be placed before a bug spot node
 * @param {Vector3} position A bug spot position
 * @param {Random} random A randomizer
 * @returns {BugPathNode} The approach node
 */
BugPathMaker.prototype.makeApproachNode = function(position, random) {
    const distance = this.APPROACH_DISTANCE.sample(random.getFloat());
    const angle = this.APPROACH_ANGLE.sample(random.getFloat());

    return new BugPathNode(new Vector3(
        position.x + Math.cos(angle) * distance,
        position.y + Math.sin(angle) * distance,
        this.ALTITUDE + (position.z - this.ALTITUDE) * this.APPROACH_ALTITUDE));
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
 * @param {BugSpot[]} [excludeSpots] A list of spots that may not be visited
 * @returns {BugPathNode[]} The nodes in the path
 */
BugPathMaker.prototype.trace = function(
    origin,
    direction,
    random,
    stopAtSpot = false,
    excludeSpots = null) {
    const nodes = [];
    const spots = [];
    const spotDistances = [];
    const angle = direction.angle();
    const aCos = Math.cos(this.CONE_ANGLE * .5);

    if (stopAtSpot) for (const spot of this.bugSpots) if (excludeSpots.indexOf(spot) === -1) {
        const delta = spot.position.vector2().subtract(origin);
        const distance = delta.length();

        if (delta.normalize().dot(direction) > aCos) {
            spots.push(spot);
            spotDistances.push(distance);
        }
    }

    for (let radius = this.CONE_STEP;; radius += this.CONE_STEP) {
        const radiusNext = radius + this.CONE_STEP;

        if (stopAtSpot) {
            const endPoints = [];

            for (let spot = 0, spotCount = spots.length; spot < spotCount; ++spot)
                if (spotDistances[spot] > radius && spotDistances[spot] < radiusNext)
                    endPoints.push(spots[spot]);

            if (endPoints.length !== 0) {
                const spot = this.occupySpot(endPoints[Math.floor(random.getFloat() * endPoints.length)]);

                nodes.push(
                    this.makeApproachNode(spot.position, random),
                    new BugPathNode(spot.position, spot));

                break;
            }
        }

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
                this.ALTITUDE));
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
            bestCandidate.position.y > this.constellation.height + this.EDGE_PADDING + this.EDGE_PADDING_Z)
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

    return new BugPath([
        new BugPathNode(target.position, target),
        this.makeApproachNode(target.position, random),
        ...this.trace(origin, exitVector, random)].reverse());
};

/**
 * Make a wandering path, ending either at another bug spot or outside the view
 * @param {Vector3} origin The start position
 * @param {BugSpot[]} excludeSpots A list of spots that may not be visited
 * @param {Random} random A randomizer
 * @param {Vector2} [direction] The initial direction
 * @returns {BugPath} A bug path
 */
BugPathMaker.prototype.makeWander = function(
    origin,
    excludeSpots,
    random,
    direction = new Vector2().fromAngle(random.getFloat() * Math.PI * 2)) {
    return new BugPath([
        new BugPathNode(origin),
        this.makeApproachNode(origin, random),
        ...this.trace(origin.vector2(), direction, random,true, excludeSpots)]);
};

/**
 * Make a hop path, hopping to another nearby unvisited bug spot
 * @param {Vector3} origin The start position
 * @param {BugSpot[]} excludeSpots A list of spots that may not be visited
 * @param {Random} random A randomizer
 * @returns {BugPath} A bug path, or null if no hop is possible
 */
BugPathMaker.prototype.makeHop = function(
    origin,
    excludeSpots,
    random) {
    const inRange = [];

    for (const spot of this.bugSpots) if (excludeSpots.indexOf(spot) === -1) {
        const dx = spot.position.x - origin.x;
        const dy = spot.position.y - origin.y;

        if (dx * dx + dy * dy < this.HOP_RADIUS * this.HOP_RADIUS)
            inRange.push(spot);
    }

    if (inRange.length === 0)
        return null;

    const spot = this.occupySpot(inRange[Math.floor(random.getFloat() * inRange.length)]);

    return new BugPath([
        new BugPathNode(origin),
        this.makeApproachNode(origin, random),
        this.makeApproachNode(spot.position, random),
        new BugPathNode(spot.position, spot)]);
};