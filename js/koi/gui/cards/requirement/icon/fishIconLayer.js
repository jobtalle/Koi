/**
 * A layer to add on a fish icon
 * @constructor
 */
const FishIconLayer = function() {
    this.group = SVG.createGroup();

    this.draw(this.group);

    SVG.setMask(this.group, FishIconLayer.prototype.ID_MASK);
};

FishIconLayer.prototype.ID_MASK = "fish-icon-layer-mask";
FishIconLayer.prototype.ID_WILDCARD = "fish-icon-layer-wildcard";
FishIconLayer.prototype.ID_BASE = "fish-icon-layer-pattern-base-";
FishIconLayer.prototype.COLOR_WILDCARD = Color.fromCSS("--book-page-slot-color-icon-neutral");
FishIconLayer.prototype.WIDTH = 30;
FishIconLayer.prototype.HEIGHT = 70;
FishIconLayer.FIN_X = 6;
FishIconLayer.FIN_Y = 22;

/**
 * Make the fish icon layer mask
 * @returns {SVGMaskElement} The mask element
 */
FishIconLayer.makeMask = function() {
    const mask = SVG.createMask();

    SVG.setId(mask, FishIconLayer.prototype.ID_MASK);

    mask.appendChild(FishIconLayer.prototype.createBodyPath());
    mask.appendChild(SVG.createCircle(
        FishIconLayer.FIN_X,
        FishIconLayer.FIN_Y,
        FishIconLayer.FIN_X));
    mask.appendChild(SVG.createCircle(
        FishIconLayer.prototype.WIDTH - FishIconLayer.FIN_X,
        FishIconLayer.FIN_Y,
        FishIconLayer.FIN_X));

    return mask;
}

/**
 * Make all wildcard definitions
 */
FishIconLayer.makeDefsWildcard = function() {
    const pattern = SVG.createPattern();
    const element = SVG.createRect(0, 0, FishIconLayer.prototype.WIDTH, FishIconLayer.prototype.HEIGHT);

    SVG.setFill(element, FishIconLayer.prototype.COLOR_WILDCARD.toHex());
    SVG.setId(pattern, FishIconLayer.prototype.ID_WILDCARD);

    pattern.appendChild(element);

    SVG.DEFS.appendChild(pattern);
};

/**
 * Make all base pattern definitions
 */
FishIconLayer.makeDefsPatternsBase = function() {
    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();
        const element = SVG.createRect(0, 0, FishIconLayer.prototype.WIDTH, FishIconLayer.prototype.HEIGHT);

        SVG.setFill(element, Palette.COLORS[paletteIndex].toHex());
        SVG.setId(pattern, FishIconLayer.prototype.ID_BASE + paletteIndex.toString());

        pattern.appendChild(element);

        SVG.DEFS.appendChild(pattern);
    }
};

/**
 * Make all pattern definitions
 */
FishIconLayer.makeDefsPatterns = function() {
    FishIconLayer.makeDefsWildcard();
    FishIconLayer.makeDefsPatternsBase();
};

/**
 * Make all defs used by icon layers
 */
FishIconLayer.makeDefs = function() {
    SVG.DEFS.appendChild(FishIconLayer.makeMask());

    FishIconLayer.makeDefsPatterns();
};

/**
 * Create a path representing the fish body
 * @returns {SVGPathElement} The path element
 */
FishIconLayer.prototype.createBodyPath = function() {
    return SVG.createPath([
        "M", this.WIDTH * .5, 0,
        "C", this.WIDTH, 0, this.WIDTH, this.HEIGHT - this.WIDTH * .5, this.WIDTH * .5, this.HEIGHT,
        "C", 0, this.HEIGHT - this.WIDTH * .5, 0, 0, this.WIDTH * .5, 0
    ]);
};

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