/**
 * Mix two fin sets
 * @param {Fins} mother The mother fins
 * @param {Fins} father The father fins
 * @constructor
 */
const MixerFins = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerFins.prototype = Object.create(Mixer.prototype);

/**
 * Create a new set of fins that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Fins} The mixed fins
 */
MixerFins.prototype.mix = function(random) {
    const fins = [];

    for (let fin = 0; fin < this.mother.fins.length; ++fin)
        fins.push(new MixerFin(this.mother.fins[fin], this.father.fins[fin]).mix(random));

    return new Fins(fins);
};