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

    for (let fin = 0; fin < Math.min(this.mother.fins.length, this.father.fins.length); ++fin) {
        const mother = fin < this.mother.fins.length ? this.mother.fins[fin] : null;
        const father = fin < this.father.fins.length ? this.father.fins[fin] : null;

        if (mother && father)
            fins.push(new MixerFin(mother, father).mix(random));
        else if (mother)
            fins.push(mother.copy());
        else
            fins.push(father.copy());
    }

    return new Fins(fins);
};