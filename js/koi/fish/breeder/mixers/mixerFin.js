/**
 * Mix two fins
 * @param {Fin} mother The mother fin
 * @param {Fin} father The father fin
 * @constructor
 */
const MixerFin = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerFin.prototype = Object.create(Mixer.prototype);

/**
 * Create a new fin that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Fin} The mixed fin
 */
MixerFin.prototype.mix = function(random) { // TODO: Mix
    return new Fin(this.mother.at, this.mother.radius);
};