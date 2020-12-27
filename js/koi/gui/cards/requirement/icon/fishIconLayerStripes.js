/**
 * A fish icon stripes layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerStripes = function(paletteIndex) {
    FishIconLayer.call(this, paletteIndex);
};

FishIconLayerStripes.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 * @param {Number} index The layer index
 */
FishIconLayerStripes.prototype.draw = function(group, index) {
    switch (index) {
        case 1:
            group.appendChild(this.createFilledLayer(this.ID_STRIPES_A + this.paletteIndex.toString()));

            break;
        case 2:
            group.appendChild(this.createFilledLayer(this.ID_STRIPES_B + this.paletteIndex.toString()));

            break;
    }
};