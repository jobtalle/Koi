/**
 * A layer to add on a fish icon
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayer = function(paletteIndex) {
    this.paletteIndex = paletteIndex;
};

FishIconLayer.prototype = Object.create(FishIconConstants.prototype);

/**
 * Create a filled fish shape
 * @param {String} id The fill ID
 * @returns {HTMLElement} The SVG element
 */
FishIconLayer.prototype.createFilledLayer = function(id) {
    const element = SVG.createRect(0, 0, this.WIDTH, this.HEIGHT);

    SVG.setPattern(element, id);

    return element;
};

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 * @param {Number} index The layer index
 */
FishIconLayer.prototype.draw = function(group, index) {

};

/**
 * Make the SVG group containing this layer
 * @param {SVGGElement} group The group to draw in
 * @param {Number} [index] The layer index
 */
FishIconLayer.prototype.addToGroup = function(group, index = 0) {
    this.draw(group, index);
};