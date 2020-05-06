/**
 * A pond constellation consisting of a large pond, a small pond, and space for a river between
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @constructor
 */
const Constellation = function(width, height) {
    this.angle = 0;
    this.width = width;
    this.height = height;
    this.big = null;
    this.small = null;
    this.river = null;

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
 * Calculate the constellation layout
 */
Constellation.prototype.fit = function() {
    const pondDiagonal = 1 + 2 * this.FACTOR_PADDING + this.FACTOR_RIVER + this.FACTOR_SMALL;
    const angleOffset = Math.asin((1 - this.FACTOR_SMALL) / pondDiagonal);
    const angle = angleOffset;
    const width = 1 + Math.cos(angle) * pondDiagonal + this.FACTOR_SMALL;
    const height = 1 + Math.sin(angle) * pondDiagonal + this.FACTOR_SMALL;
    const scale = this.width / width;

    const constraintBig = new ConstraintCircle(
        new Vector2(1, 1).multiply(scale),
        scale);
    const constraintSmall = new ConstraintCircle(
        new Vector2(1 + Math.cos(angle) * pondDiagonal, 1 + Math.sin(angle) * pondDiagonal).multiply(scale),
        scale * this.FACTOR_SMALL);
    const constraintRiver = new ConstraintArcPath(
        [
            new ConstraintArcPath.Arc(
                constraintBig.position,
                scale * (1 + this.FACTOR_PADDING + this.FACTOR_RIVER * .5),
                angleOffset,
                Math.PI * .5),
            new ConstraintArcPath.Arc(
                constraintSmall.position,
                scale * (this.FACTOR_SMALL + this.FACTOR_PADDING + this.FACTOR_RIVER * .5),
                Math.PI + angleOffset,
                Math.PI * 1.5)
        ],
        scale * this.FACTOR_RIVER);

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
};