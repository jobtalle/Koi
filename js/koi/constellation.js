/**
 * A pond constellation consisting of a large pond, a small pond, and space for a river between
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @constructor
 */
const Constellation = function(width, height) {
    this.width = width;
    this.height = height * this.Y_SCALE;
    this.big = null;
    this.small = null;
    this.river = null;
    this.spawnPoint = null;
    this.spawnDirection = null;

    this.fit();
};

Constellation.prototype.FACTOR_PADDING = .14;
Constellation.prototype.FACTOR_SMALL = .65;
Constellation.prototype.FACTOR_RIVER = .55;
Constellation.prototype.Y_SCALE = 1.1;

/**
 * Serialize this constellation
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Constellation.prototype.serialize = function(buffer) {
    this.big.serialize(buffer);
    this.small.serialize(buffer);
    this.river.serialize(buffer);
};

/**
 * Deserialize this constellation
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @param {Atlas} atlas The atlas
 * @param {RandomSource} randomSource A random source
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Constellation.prototype.deserialize = function(buffer, atlas, randomSource) {
    this.big.deserialize(buffer, atlas, randomSource);
    this.small.deserialize(buffer, atlas, randomSource);
    this.river.deserialize(buffer, atlas, randomSource);
};

/**
 * Get the X position in meters
 * @param {Number} x The X position in pixels
 * @param {Number} scale The scale
 */
Constellation.prototype.getWorldX = function(x, scale) {
    return x / scale;
};

/**
 * Get the Y position in meters
 * @param {Number} y The Y position in pixels
 * @param {Number} scale The scale
 */
Constellation.prototype.getWorldY = function(y, scale) {
    return y / scale * this.Y_SCALE;
};

/**
 * Get the X position in pixels
 * @param {Number} x The X position in meters
 * @param {Number} scale The scale
 */
Constellation.prototype.getPixelX = function(x, scale) {
    return x * scale;
};

/**
 * Get the Y position in pixels
 * @param {Number} y The Y position in meters
 * @param {Number} scale The scale
 */
Constellation.prototype.getPixelY = function(y , scale) {
    return y * scale / this.Y_SCALE;
};

/**
 * Resize the constellation
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Atlas} atlas The texture atlas
 */
Constellation.prototype.resize = function(width, height, atlas) {
    this.width = width;
    this.height = height * this.Y_SCALE;

    this.fit(atlas);
};

/**
 * Get the number of fish existing in the constellation
 * @returns {Number}
 */
Constellation.prototype.getFishCount = function() {
    return this.big.getFishCount() + this.small.getFishCount() + this.river.getFishCount();
};

/**
 * Calculate the radius of the big pond which makes all elements fit optimally
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 */
Constellation.prototype.getBigPondRadius = function(width, height) {
    const p1 = this.FACTOR_SMALL + 1;
    const a = (this.FACTOR_RIVER + p1) * (this.FACTOR_RIVER + p1) - 2 * p1 * p1;
    const b = (p1 + p1) * (height + width);
    const c = height * height + width * width;

    return (Math.sqrt(b * b + 4 * a * c) - b) / (a + a);
};

/**
 * Calculate the constellation layout
 * @param {Atlas} [atlas] The texture atlas, required when fish exist in the constellation
 */
Constellation.prototype.fit = function(atlas = null) {
    const radiusBigMax = Math.min(this.width, this.height) * .5;
    const radiusBig = Math.min(this.getBigPondRadius(this.width, this.height), radiusBigMax);
    const radiusSmall = this.FACTOR_SMALL * radiusBig;
    const centerBig = new Vector2(radiusBig, radiusBig);
    const centerSmall = new Vector2(this.width - radiusSmall, this.height - radiusSmall);
    const riverWidth = centerSmall.copy().subtract(centerBig).length() - radiusBig - radiusSmall;
    const riverTurn = Math.atan((centerSmall.y - centerBig.y) / (centerSmall.x - centerBig.x));

    const fullTurn = radiusBig !== radiusBigMax;
    const constraintBig = new ConstraintCircle(
        centerBig,
        radiusBig * (1 - this.FACTOR_PADDING));
    const constraintSmall = new ConstraintCircle(
        centerSmall,
        radiusSmall - radiusBig * this.FACTOR_PADDING);
    let constraintRiver;

    if (this.width > this.height) {
        constraintRiver = new ConstraintArcPath(
            [
                new ConstraintArcPath.Arc(
                    centerBig,
                    radiusBig + riverWidth * .5,
                    riverTurn,
                    fullTurn ? Math.PI : Math.PI * .5),
                new ConstraintArcPath.Arc(
                    centerSmall,
                    radiusSmall + riverWidth * .5,
                    Math.PI + riverTurn,
                    Math.PI * 2)
            ],
            radiusBig * this.FACTOR_RIVER);

        if (fullTurn) {
            this.spawnPoint = new Vector2(riverWidth * -.5, radiusBig + .000001);
            this.spawnDirection = new Vector2(0, 1);
        }
        else {
            this.spawnPoint = new Vector2(radiusBig + .000001, this.height + riverWidth * .5);
            this.spawnDirection = new Vector2(1, 0);
        }
    }
    else {
        constraintRiver = new ConstraintArcPath(
            [
                new ConstraintArcPath.Arc(
                    centerBig,
                    radiusBig + riverWidth * .5,
                    fullTurn ? Math.PI * 1.5 : 0,
                    fullTurn ? Math.PI * 2 + riverTurn : riverTurn),
                new ConstraintArcPath.Arc(
                    centerSmall,
                    radiusSmall + riverWidth * .5,
                    Math.PI * .5,
                    Math.PI + riverTurn)
            ],
            radiusBig * this.FACTOR_RIVER);

        if (fullTurn) {
            this.spawnPoint = new Vector2(radiusBig + .000001, riverWidth * -.5);
            this.spawnDirection = new Vector2(1, 0);
        }
        else {
            this.spawnPoint = new Vector2(this.width + riverWidth * .5, radiusBig + .000001);
            this.spawnDirection = new Vector2(0, 1);
        }
    }

    if (this.big) {
        this.big.replaceConstraint(constraintBig, atlas);
        this.small.replaceConstraint(constraintSmall, atlas);
        this.river.replaceConstraint(constraintRiver, atlas);
    }
    else {
        this.big = new Pond(constraintBig);
        this.small = new Pond(constraintSmall);
        this.river = new Pond(constraintRiver, false);
    }
};

/**
 * Pick up a fish at given coordinates
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Fish} The fish at the given position, or null if no fish exists there
 */
Constellation.prototype.pick = function(x, y) {
    return this.big.pick(x, y) || this.small.pick(x, y) || this.river.pick(x, y) || null;
};

/**
 * Chase fish away from a given point
 * @param {Number} x The X position
 * @param {Number} y The Y position
 */
Constellation.prototype.chase = function(x, y) {
    if (this.big.constraint.contains(x, y))
        this.big.chase(x, y);
    else if (this.small.constraint.contains(x, y))
        this.small.chase(x, y);
    else if (this.river.constraint.contains(x, y))
        this.river.chase(x, y);
};

/**
 * Check if the constellation water contains a given point
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Boolean} A boolean indicating whether the given coordinates are inside water
 */
Constellation.prototype.contains = function(x, y) {
    return this.big.constraint.contains(x, y) ||
        this.small.constraint.contains(x, y) ||
        this.river.constraint.contains(x, y);
};

/**
 * Drop a fish in the nearest suitable location of this constellation
 * @param {Fish} fish A fish
 */
Constellation.prototype.drop = function(fish) {
    if (this.big.constraint.contains(fish.position.x, fish.position.y))
        this.big.addFish(fish);
    else if (this.small.constraint.contains(fish.position.x, fish.position.y))
        this.small.addFish(fish);
    else if (this.river.constraint.contains(fish.position.x, fish.position.y))
        this.river.addFish(fish);
    else {
        const nearestBig = fish.position.copy();
        const nearestSmall = fish.position.copy();
        const nearestRiver = fish.position.copy();

        this.big.constraint.constrain(nearestBig);
        this.small.constraint.constrain(nearestSmall);

        let nearestDist = fish.position.copy().subtract(nearestBig).length();
        let nearestPosition = nearestBig;
        let nearest = this.big;

        const smallDist = fish.position.copy().subtract(nearestSmall).length();

        if (smallDist < nearestDist) {
            nearestDist = smallDist;
            nearestPosition = nearestSmall;
            nearest = this.small;
        }

        if (this.river.constraint.constrain(nearestRiver)) {
            if (fish.position.copy().subtract(nearestRiver).length() < nearestDist) {
                nearestPosition = nearestRiver;
                nearest = this.river;
            }
        }

        fish.drop(nearestPosition);

        nearest.addFish(fish);
    }
};

/**
 * Calculate the distance to the nearest body of water
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The distance to the nearest body of water
 */
Constellation.prototype.distanceToWater = function(x, y) {
    return Math.min(
        Math.min(
            this.small.constraint.distanceToWater(x, y),
            this.big.constraint.distanceToWater(x, y)),
        this.river.constraint.distanceToWater(x, y));
};

/**
 * Make a mask mesh overlapping all water area
 * @param {WebGLRenderingContext} gl A WebGL context
 * @returns {Mesh} A mesh
 */
Constellation.prototype.makeMeshWater = function(gl) {
    const vertices = [];
    const indices = [];

    this.big.constraint.appendMeshWater(vertices, indices);
    this.small.constraint.appendMeshWater(vertices, indices);
    this.river.constraint.appendMeshWater(vertices, indices);

    new MeshNormalizer(this.width, this.height, 2, [0], [1]).apply(vertices);

    return new Mesh(gl, new MeshData(vertices, indices));
};

/**
 * Make a mesh for the bottom of the water bodies
 * @param {WebGLRenderingContext} gl A WebGL context
 * @returns {Mesh} A mesh
 */
Constellation.prototype.makeMeshDepth = function(gl) {
    const vertices = [];
    const indices = [];

    this.big.constraint.appendMeshDepth(vertices, indices);
    this.small.constraint.appendMeshDepth(vertices, indices);
    this.river.constraint.appendMeshDepth(vertices, indices);

    new MeshNormalizer(this.width, this.height, 4, [0], [1]).apply(vertices);

    return new Mesh(gl, new MeshData(vertices, indices));
};

/**
 * Update the constellation
 * @param {Atlas} atlas The pattern atlas
 * @param {Patterns} patterns The pattern renderer
 * @param {RandomSource} randomSource A random source
 * @param {Mutations} mutations The mutations object
 * @param {Water} water A water plane to disturb
 * @param {Random} random A randomizer
 */
Constellation.prototype.update = function(
    atlas,
    patterns,
    randomSource,
    mutations,
    water,
    random) {
    this.small.update(atlas, patterns, randomSource, mutations, water, this, random);
    this.big.update(atlas, patterns, randomSource, mutations, water, this, random);
    this.river.update(atlas, patterns, randomSource, mutations, water, this, random);
};

/**
 * Render the constellation
 * @param {Bodies} bodies The bodies renderer
 * @param {Atlas} atlas The atlas containing the fish textures
 * @param {Number} time The amount of time since the last update
 * @param {Boolean} shadows A boolean indicating whether shadows or actual bodies should be rendered
 * @param {Boolean} [firstPass] A boolean indicating whether this was the first pass, true by default
 */
Constellation.prototype.render = function(
    bodies,
    atlas,
    time,
    shadows,
    firstPass = true) {
    if (firstPass) {
        this.big.render(bodies, time);
        this.small.render(bodies, time);
        this.river.render(bodies, time);
    }

    bodies.render(atlas, this.width, this.height, shadows, shadows);
};