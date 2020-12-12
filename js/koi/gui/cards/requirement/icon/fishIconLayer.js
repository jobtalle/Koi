/**
 * A layer to add on a fish icon
 * @constructor
 */
const FishIconLayer = function() {
    this.group = SVG.createGroup();

    this.draw(this.group);

    SVG.setMask(this.group, FishIconLayer.prototype.ID_MASK);
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
 */
FishIconLayer.prototype.draw = function(group) {

};