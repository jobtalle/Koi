/**
 * A card background
 * @param {HTMLElement} element The element to build the icon in
 * @param {Number} width The background width
 * @param {Number} height The background height
 * @param {Random} random A randomizer
 * @constructor
 */
const CardBackground = function(element, width, height, random) {
    element.appendChild(this.createBackground(width, height, random));
};

CardBackground.prototype.HEIGHT = new Sampler(.5, .75);
CardBackground.prototype.SWAY = new SamplerSigmoid(-.4, .4, 3);
CardBackground.prototype.SWAY_DEFAULT = .3;
CardBackground.prototype.SHIFT_Y = .07;
CardBackground.prototype.BLADE_WIDTH = 20;
CardBackground.prototype.BASE_HEIGHT = .1;
CardBackground.prototype.DAMPING = .7;

/**
 * Create the background image
 * @param {Number} width The background width
 * @param {Number} height The background height
 * @param {Random} random A randomizer
 * @returns {SVGSVGElement} The background image
 */
CardBackground.prototype.createBackground = function(width, height, random) {
    const background = SVG.createElement();
    const base = height * (1 + this.SHIFT_Y);
    const path = ["M", 0, base + this.BASE_HEIGHT, "L", 0, base];
    const bladeCount = Math.round(width / this.BLADE_WIDTH);
    const bladeWidth = width / bladeCount;
    const defaultSign = random.getFloat() > .5 ? -1 : 1;

    for (let blade = 0; blade < bladeCount; ++blade) {
        const x = (blade + .5) * bladeWidth;
        const progress = (blade + .5) / bladeCount;
        const heightFactor = (2 * progress - 1) * (2 * progress - 1);
        const bladeHeight = this.HEIGHT.sample(random.getFloat()) * height * (heightFactor * this.DAMPING + 1 - this.DAMPING);
        const sway = this.SWAY.sample(random.getFloat()) + ((blade & 1) * 2 - 1) * defaultSign * this.SWAY_DEFAULT;

        path.push(
            "Q",
            x - bladeWidth * .5,
            base - bladeHeight,
            x + sway * bladeHeight,
            base - bladeHeight,
            "Q",
            x,
            base - bladeHeight,
            x + bladeWidth * .5,
            base);
    }

    path.push("L", width, base + this.BASE_HEIGHT, "Z");

    background.appendChild(SVG.createPath(path));

    return background;
};

/**
 * Create a grass path section
 * @param {Number} x The X origin coordinate
 * @param {Number} y The Y origin coordinate
 * @param {Number} width The blade width
 * @param {Number} height The blade height
 * @param {Number} sway The horizontal sway
 * @returns {Number[]} The blade path commands
 */
CardBackground.prototype.createBlade = function(x, y, width, height, sway) {
    return [
        "M",
        x - width * .5,
        y,
        "Q",
        x,
        y - height,
        x + sway * height,
        y - height,
        "Q",
        x,
        y - height,
        x + width * .5,
        y,
    ];
};