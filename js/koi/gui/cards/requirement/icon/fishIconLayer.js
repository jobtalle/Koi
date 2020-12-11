/**
 * A layer to add on a fish icon
 * @constructor
 */
const FishIconLayer = function() {
    this.group = SVG.createGroup(this.CLASS);

    this.draw(this.group);
};

FishIconLayer.prototype.CLASS = "layer";
FishIconLayer.prototype.CLASS_FILL = "fill";
FishIconLayer.prototype.CLASS_OUTLINE = "outline";
FishIconLayer.prototype.ID_MASK = "fish-icon-layer-mask";
FishIconLayer.prototype.EYE_RADIUS = 3;
FishIconLayer.prototype.EYE_X = 10;
FishIconLayer.prototype.EYE_Y = 10;
FishIconLayer.prototype.WIDTH = 30;
FishIconLayer.prototype.HEIGHT = 70;

/**
 * Make the fish icon layer mask
 * @returns {SVGMaskElement} The mask element
 */
FishIconLayer.makeMask = function() {
    const mask = SVG.createMask(FishIconLayer.prototype.ID_MASK);

    mask.appendChild(FishIconLayer.prototype.createBodyPath(
        FishIconLayer.prototype.WIDTH,
        FishIconLayer.prototype.HEIGHT));

    return mask;
}

/**
 * Make all defs used by icon layers
 */
FishIconLayer.makeDefs = function() {
    SVG.DEFS.appendChild(FishIconLayer.makeMask());
};

/**
 * Create a path representing the fish body
 * @param {Number} width The body width
 * @param {Number} height The body height
 * @param {String} [className] The class name
 * @returns {SVGPathElement} The path element
 */
FishIconLayer.prototype.createBodyPath = function(width, height, className) {
    return SVG.createPath([
        "M", width * .5, 0,
        "C", width, 0, width, height - width * .5, width * .5, height,
        "C", 0, height - width * .5, 0, 0, width * .5, 0

        // "M", 0, height * .5,
        // "C", 0, height, width - height * .5, height, width, height * .5,
        // "C", width - height * .5, 0, 0, 0, 0, height * .5
    ], className);
};

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayer.prototype.draw = function(group) {

};