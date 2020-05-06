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
    this.spawnDirection = new Vector2(0, 1);

    this.fit();
};

Constellation.prototype.FACTOR_PADDING = .1;
Constellation.prototype.FACTOR_SMALL = .7;
Constellation.prototype.FACTOR_RIVER = .5;

/**
 * Resize the constellation
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 */
Constellation.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.fit();
};

/**
 * Get the total number of fish this constellation supports
 * @returns {Number} The total fish capacity
 */
Constellation.prototype.getCapacity = function() {
    return this.big.capacity + this.small.capacity + this.river.capacity;
};

/**
 * Calculate the constellation layout
 */
Constellation.prototype.fit = function() {
    const p = this.FACTOR_SMALL;
    const q = this.FACTOR_RIVER;
    const w = this.width;
    const h = this.height;

    // TODO: Really, clean this mess up
    const radiusBig = Math.min(
        (Math.sqrt(Math.pow(2 * h * p + 2 * h + 2 * p * w + 2 * w, 2) - 4 * (- (h * h) - (w * w)) * (-(p * p) + 2 * p * q - 2 * p + q * q + 2 * q - 1)) -
            2 * h * p - 2 * h - 2 * p * w - 2 * w) / (2 * (-(p * p) + 2 * p * q - 2 * p + q * q + 2 * q - 1)),
        Math.min(this.width, this.height) * .5);
    const radiusSmall = this.FACTOR_SMALL * radiusBig;
    const centerBig = new Vector2(radiusBig, radiusBig);
    const centerSmall = new Vector2(this.width - radiusSmall, this.height - radiusSmall);
    const riverWidth = centerSmall.copy().subtract(centerBig).length() - radiusBig - radiusSmall;
    const riverTurn = Math.atan((centerSmall.y - centerBig.y) / (centerSmall.x - centerBig.x));

    const constraintBig = new ConstraintCircle(
        centerBig,
        radiusBig * (1 - this.FACTOR_PADDING));
    const constraintSmall = new ConstraintCircle(
        centerSmall,
        radiusSmall - radiusBig * this.FACTOR_PADDING);
    const constraintRiver = new ConstraintArcPath(
        [
            new ConstraintArcPath.Arc(
                centerBig,
                radiusBig + riverWidth * .5,
                riverTurn,
                Math.PI),
            new ConstraintArcPath.Arc(
                centerSmall,
                radiusSmall + riverWidth * .5,
                Math.PI + riverTurn,
                Math.PI * 2)
        ],
        radiusBig * this.FACTOR_RIVER);

    if (this.big) {
        this.big.replaceConstraint(constraintBig);
        this.small.replaceConstraint(constraintSmall);
        this.river.replaceConstraint(constraintRiver);
    }
    else {
        this.big = new Pond(constraintBig);
        this.small = new Pond(constraintSmall);
        this.river = new Pond(constraintRiver);
    }

    this.spawnPoint = new Vector2(riverWidth * -.5, radiusBig + .000001);
};