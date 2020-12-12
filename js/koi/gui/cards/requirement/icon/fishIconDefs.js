/**
 * Fish icon SVG definitions
 * @param {HTMLElement} defs The defs element to populate
 * @constructor
 */
const FishIconDefs = function(defs) {
    this.makeMask(defs);
    this.makeWildcard(defs);
    this.makePatternsBase(defs);
};

FishIconDefs.prototype = Object.create(FishIconConstants.prototype);
FishIconDefs.prototype.FIN_X = 6;
FishIconDefs.prototype.FIN_Y = 22;
FishIconDefs.prototype.CLASSES_COLOR = [
    "white",
    "black",
    "gold",
    "orange",
    "red",
    "brown"
];

/**
 * Create a path representing the fish body
 * @returns {SVGPathElement} The path element
 */
FishIconDefs.prototype.createBodyPath = function() {
    return SVG.createPath([
        "M", this.WIDTH * .5, 0,
        "C", this.WIDTH, 0, this.WIDTH, this.HEIGHT - this.WIDTH * .5, this.WIDTH * .5, this.HEIGHT,
        "C", 0, this.HEIGHT - this.WIDTH * .5, 0, 0, this.WIDTH * .5, 0
    ]);
};

/**
 * Make the fish mask definition
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makeMask = function(defs) {
    const mask = SVG.createMask();

    SVG.setId(mask, this.ID_MASK);

    mask.appendChild(this.createBodyPath());
    mask.appendChild(SVG.createCircle(this.FIN_X, this.FIN_Y, this.FIN_X));
    mask.appendChild(SVG.createCircle(this.WIDTH - this.FIN_X, this.FIN_Y, this.FIN_X));

    defs.appendChild(mask);
};

/**
 * Make the wildcard pattern definition
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makeWildcard = function(defs) {
    const pattern = SVG.createPattern();
    const element = SVG.createRect(0, 0, this.WIDTH, this.HEIGHT);

    SVG.setId(pattern, this.ID_WILDCARD);

    pattern.appendChild(element);
    defs.appendChild(pattern);
};

/**
 * Make the base pattern definitions
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makePatternsBase = function(defs) {
    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();
        const element = SVG.createRect(0, 0, this.WIDTH, this.HEIGHT);

        SVG.setId(pattern, this.ID_BASE + paletteIndex.toString());
        SVG.setClass(pattern, this.CLASSES_COLOR[paletteIndex]);

        pattern.appendChild(element);
        defs.appendChild(pattern);
    }
};