/**
 * A fish icon spots layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerSpots = function(paletteIndex) {
    FishIconLayer.call(this, paletteIndex);
};

FishIconLayerSpots.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 * @param {Number} index The layer index
 */
FishIconLayerSpots.prototype.draw = function(group, index) {
    switch (index) {
        case 1:
            group.appendChild(this.createFilledLayer(this.ID_SPOTS_A + this.paletteIndex.toString()));

            break;
        case 2:
            group.appendChild(this.createFilledLayer(this.ID_SPOTS_B + this.paletteIndex.toString()));

            break;
    }
};