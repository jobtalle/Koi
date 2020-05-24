/**
 * A pond constellation consisting of a large pond, a small pond, and space for a river between
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @constructor
 */
const Constellation = function(width, height) {
    this.width = width;
    this.height = height;
    this.big = null;
    this.small = null;
    this.river = null;
    this.spawnPoint = null;
    this.spawnDirection = null;

    this.fit();
};

Constellation.prototype.FACTOR_PADDING = .15;
Constellation.prototype.FACTOR_SMALL = .7;
Constellation.prototype.FACTOR_RIVER = .6;
Constellation.prototype.FISH_PER_AREA = 1;

/**
 * Update the atlas, write all fish textures again
 * @param {Atlas} atlas The atlas
 */
Constellation.prototype.updateAtlas = function(atlas) {
    this.big.updateAtlas(atlas);
    this.small.updateAtlas(atlas);
    this.river.updateAtlas(atlas);
};

/**
 * Resize the constellation
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Atlas} atlas The texture atlas
 */
Constellation.prototype.resize = function(width, height, atlas) {
    this.width = width;
    this.height = height;

    this.fit(atlas);
};

/**
 * Get the total number of fish this constellation supports
 * @returns {Number} The total fish capacity
 */
Constellation.prototype.getCapacity = function() {
    return Math.ceil(this.FISH_PER_AREA * Math.PI * (
        this.big.constraint.radius * this.big.constraint.radius +
        this.small.constraint.radius * this.small.constraint.radius));
};

/**
 * Get the number of fish existing in the constellation
 * @returns {Number}
 */
Constellation.prototype.getFishCount = function() {
    return this.big.fishes.length + this.small.fishes.length + this.river.fishes.length;
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
        this.river = new Pond(constraintRiver);
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
 * Check if the constellation water contains a given point
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Boolean} A boolean indicating whether the given coordinates are inside water
 */
Constellation.prototype.contains = function(x, y) {
    return this.big.constraint.contains(x, y) || this.small.constraint.contains(x, y) || this.river.constraint.contains(x, y);
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
 * Make a mask mesh overlapping all water area
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Random} random A randomizer
 * @returns {Mesh} A mesh
 */
Constellation.prototype.makeMeshWater = function(gl, random) {
    const vertices = [];
    const indices = [];

    this.big.constraint.appendMeshWater(vertices, indices, random);
    this.small.constraint.appendMeshWater(vertices, indices, random);
    this.river.constraint.appendMeshWater(vertices, indices, random);

    return new Mesh(gl, vertices, indices);
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

    return new Mesh(gl, vertices, indices);
};

/**
 * Update the constellation
 * @param {Atlas} atlas The pattern atlas
 * @param {WaterPlane} water A water plane to disturb
 * @param {Random} random A randomizer
 */
Constellation.prototype.update = function(atlas, water, random) {
    this.small.update(atlas, water, random);
    this.big.update(atlas, water, random);
    this.river.update(atlas, water, random);
};

/**
 * Render the constellation
 * @param {Bodies} bodies The bodies renderer
 * @param {Atlas} atlas The atlas containing the fish textures
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The render scale
 * @param {Number} time The amount of time since the last update
 */
Constellation.prototype.render = function(
    bodies,
    atlas,
    width,
    height,
    scale,
    time) {
    this.big.render(bodies, time);
    this.small.render(bodies, time);
    this.river.render(bodies, time);

    bodies.render(atlas, width, height, scale);
};