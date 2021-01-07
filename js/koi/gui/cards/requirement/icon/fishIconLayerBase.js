/**
 * A fish icon base layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerBase = function(paletteIndex) {
    FishIconLayer.call(this, paletteIndex);
};

FishIconLayerBase.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 * @param {Number} index The layer index
 */
FishIconLayerBase.prototype.draw = function(group, index) {
    group.appendChild(this.createFilledLayer(this.ID_BASE + this.paletteIndex.toString()));
};