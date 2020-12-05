/**
 * Mix fish properties
 * @param {Fish} mother The first fish
 * @param {Fish} father The second fish
 * @constructor
 */
const MixerFish = function(mother, father) {
    this.mother = mother;
    this.father = father;

    this.mixerBody = new MixerFishBody(mother.body, father.body);
};

MixerFish.prototype = Object.create(Mixer.prototype);

/**
 * Create a new fish that combines properties from both parents
 * @param {Patterns} patterns The pattern renderer
 * @param {Mutations} mutations The mutations object, or null if mutation is disabled
 * @param {Function} onMutate A function that is called when a pattern mutation occurs
 * @param {Random} random A randomizer
 * @returns {Fish} The mixed fish
 */
MixerFish.prototype.mix = function(patterns, mutations, onMutate, random) {
    return new Fish(
        this.mixerBody.mix(patterns, mutations, onMutate, random),
        this.mother.body.getOffspringPosition().copy(),
        new Vector2().fromAngle(random.getFloat() * Math.PI * 2));
};