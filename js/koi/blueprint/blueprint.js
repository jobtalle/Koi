/**
 * A blueprint for a random fish within certain parameters
 * @param {Sampler} samplerSchoolSize The school size sampler
 * @param {BlueprintBody} blueprintBody A blueprint for the fish body
 * @constructor
 */
const Blueprint = function(
    samplerSchoolSize,
    blueprintBody) {
    this.samplerSchoolSize = samplerSchoolSize;
    this.blueprintBody = blueprintBody;
};

/**
 * Get a school size for this blueprint
 * @param {Random} random A randomizer
 * @returns {Number} A school size
 */
Blueprint.prototype.getSchoolSize = function(random) {
    return Math.round(this.samplerSchoolSize.sample(random.getFloat()));
}

/**
 * Spawn a fish based on this blueprint
 * @param {Vector2} position The fish position
 * @param {Vector2} direction The fish direction vector, which must be normalized
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
Blueprint.prototype.spawn = function(
    position,
    direction,
    atlas,
    patterns,
    randomSource,
    random) {
    return new Fish(
        this.blueprintBody.spawn(atlas, patterns, randomSource, random),
        position,
        direction);
};