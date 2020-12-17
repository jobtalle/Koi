/**
 * A spot for a bug to perch on
 * @param {Vector3} position The position
 * @param {FlexSampler} flex A flex sampler applicable to the given position
 * @constructor
 */
const BugSpot = function(position, flex) {
    this.position = position;
    this.flex = flex.sample(position.x, position.z);
};