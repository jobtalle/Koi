/**
 * A fish icon ridge layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerRidge = function(paletteIndex) {
    FishIconLayer.call(this, paletteIndex);
};

FishIconLayerRidge.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 * @param {Number} index The layer index
 */
FishIconLayerRidge.prototype.draw = function(group, index) {
    switch (index) {
        case 1:
            group.appendChild(this.createFilledLayer(this.ID_RIDGE_A + this.paletteIndex.toString()));

            break;
        case 2:
            group.appendChild(this.createFilledLayer(this.ID_RIDGE_B + this.paletteIndex.toString()));

            break;
    }
};