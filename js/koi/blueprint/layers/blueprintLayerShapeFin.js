/**
 * A fin shape layer blueprint
 * @param {Sampler} samplerAngle A angle sampler
 * @param {Sampler} samplerInset A angle sampler
 * @param {Sampler} samplerDips A angle sampler
 * @param {Sampler} samplerDipPower A angle sampler
 * @param {Sampler} samplerRoundness A roundness sampler
 * @constructor
 */
const BlueprintLayerShapeFin = function(
    samplerAngle,
    samplerInset,
    samplerDips,
    samplerDipPower,
    samplerRoundness) {
    BlueprintLayer.call(this);

    this.samplerAngle = samplerAngle;
    this.samplerInset = samplerInset;
    this.samplerDips = samplerDips;
    this.samplerDipPower = samplerDipPower;
    this.samplerRoundness = samplerRoundness;
};

BlueprintLayerShapeFin.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a fin shape layer
 * @param {Random} random A randomizer
 * @param {Number} [paletteIndex] The palette index
 * @returns {LayerShapeFin} A fin shape layer
 */
BlueprintLayerShapeFin.prototype.spawn = function(random, paletteIndex = this.paletteIndex) {
    return new LayerShapeFin(
        Math.round(this.samplerAngle.sample(random.getFloat())),
        Math.round(this.samplerInset.sample(random.getFloat())),
        Math.round(this.samplerDips.sample(random.getFloat())),
        Math.round(this.samplerDipPower.sample(random.getFloat())),
        Math.round(this.samplerRoundness.sample(random.getFloat())));
};