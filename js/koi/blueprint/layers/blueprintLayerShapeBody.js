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
    this.samplerCenterPower = samplerCenterPower;
    this.samplerRadiusPower = samplerRadiusPower;
    this.samplerEyePosition = samplerEyePosition;
};

/**
 * Spawn a body shape layer
 * @param {Random} random A randomizer
 * @returns {LayerShapeBody} A body shape layer
 */
BlueprintLayerShapeBody.prototype.spawn = function(random) {
    return new LayerShapeBody(
        this.samplerCenterPower.sample(random.getFloat()),
        this.samplerRadiusPower.sample(random.getFloat()),
        this.samplerEyePosition.sample(random.getFloat()));
};