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
MixerFin.prototype.SAMPLER_AT = new Sampler(0, 1);
MixerFin.prototype.SAMPLER_RADIUS = new Sampler(0, 1);

/**
 * Create a new fin that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Fin} The mixed fin
 */
MixerFin.prototype.mix = function(random) {
    const interpolate = random.getFloat();

    return new Fin(
        this.mixUint8(this.mother.at, this.father.at, this.SAMPLER_AT, interpolate),
        this.mixUint8(this.mother.radius, this.father.radius, this.SAMPLER_RADIUS, interpolate));
};