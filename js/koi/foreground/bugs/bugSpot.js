/**
 * A spot for a bug to perch on
 * @param {Vector3} position The position
 * @param {Vector2} windPosition The wind position
 * @param {FlexSampler} flex A flex sampler applicable to the given position
 * @constructor
 */
const BugSpot = function(position, windPosition, flex) {
    this.position = position;
    this.windPosition = windPosition;
    this.flex = flex.sample(position.x, position.z);

    this.position.y += this.Y_SHIFT;
};

BugSpot.prototype.Y_SHIFT = .0001;

/**
 * Normalize the bug spot coordinates
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 */
BugSpot.prototype.normalize = function(width, height) {
    this.windPosition.x /= width;
    this.windPosition.y = 1 - this.windPosition.y / height;
};