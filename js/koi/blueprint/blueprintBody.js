/**
 * A blueprint for a random fish body within certain parameters
 * @param {Sampler} samplerLength A sampler for the length
 * @param {Sampler} samplerRadius A sampler for the radius
 * @param {Sampler} samplerGrowthSpeed The growth speed sampler
 * @param {Sampler} samplerMatingFrequency The mating frequency sampler
 * @param {Sampler} samplerOffspringCount The offspring count sampler
 * @param {Sampler} samplerAge The initial age sampler
 * @param {BlueprintFins} blueprintFins A blueprint for a set of fins
 * @param {BlueprintTail} blueprintTail A blueprint for a tail
 * @param {BlueprintPattern} blueprintPattern A blueprint for the body pattern
 * @constructor
 */
const BlueprintBody = function(
    samplerLength,
    samplerRadius,
    samplerGrowthSpeed,
    samplerMatingFrequency,
    samplerOffspringCount,
    samplerAge,
    blueprintFins,
    blueprintTail,
    blueprintPattern) {
    this.samplerLength = samplerLength;
    this.samplerRadius = samplerRadius;
    this.samplerGrowthSpeed = samplerGrowthSpeed;
    this.samplerMatingFrequency = samplerMatingFrequency;
    this.samplerOffspringCount = samplerOffspringCount;
    this.samplerAge = samplerAge;
    this.blueprintFins = blueprintFins;
    this.blueprintTail = blueprintTail;
    this.blueprintPattern = blueprintPattern;
};

/**
 * Spawn a fish body based on this blueprint
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {FishBody} A fish body
 */
BlueprintBody.prototype.spawn = function(
    atlas,
    patterns,
    randomSource,
    random) {
    return new FishBody(
        this.blueprintPattern.spawn(atlas, patterns, randomSource, random),
        this.blueprintFins.spawn(random),
        this.blueprintTail.spawn(random),
        Math.round(this.samplerLength.sample(random.getFloat())),
        Math.round(this.samplerRadius.sample(random.getFloat())),
        Math.round(this.samplerGrowthSpeed.sample(random.getFloat())),
        Math.round(this.samplerMatingFrequency.sample(random.getFloat())),
        Math.round(this.samplerOffspringCount.sample(random.getFloat())),
        Math.round(this.samplerAge.sample(random.getFloat())));
};