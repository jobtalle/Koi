/**
 * A body shape layer blueprint
 * @param {Sampler} samplerCenterPower A center power sampler
 * @param {Sampler} samplerRadiusPower A radius power sampler
 * @param {Sampler} samplerEyePosition An eye position sampler
 * @constructor
 */
const BlueprintLayerShapeBody = function(
    samplerCenterPower,
    samplerRadiusPower,
    samplerEyePosition) {
    BlueprintLayer.call(this);

    this.samplerCenterPower = samplerCenterPower;
    this.samplerRadiusPower = samplerRadiusPower;
    this.samplerEyePosition = samplerEyePosition;
};

BlueprintLayerShapeBody.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a body shape layer
 * @param {Random} random A randomizer
 * @param {Number} [paletteIndex] The palette index
 * @returns {LayerShapeBody} A body shape layer
 */
BlueprintLayerShapeBody.prototype.spawn = function(random, paletteIndex = this.paletteIndex) {
    return new LayerShapeBody(
        this.samplerCenterPower.sample(random.getFloat()),
        this.samplerRadiusPower.sample(random.getFloat()),
        this.samplerEyePosition.sample(random.getFloat()));
};