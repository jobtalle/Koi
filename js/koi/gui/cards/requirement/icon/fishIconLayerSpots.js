/**
 * A fish icon spots layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerSpots = function(paletteIndex) {
    this.paletteIndex = paletteIndex;

    FishIconLayer.call(this);
};

FishIconLayerSpots.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayerSpots.prototype.draw = function(group) {
    group.appendChild(this.createFilledLayer(this.ID_SPOTS_A + this.paletteIndex.toString()));
};