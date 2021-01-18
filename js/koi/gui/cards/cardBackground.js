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

CardBackground.prototype.HEIGHT = new Sampler(.3, .5);
CardBackground.prototype.SWAY = new Sampler(-.7, .7);
CardBackground.prototype.SHIFT_Y = .1;
CardBackground.prototype.BLADE_WIDTH = 20;

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
    const path = ["M", 0, base];

    SVG.setViewBox(background, 0, 0, width, height);

    for (let x = this.BLADE_WIDTH * .5; x < width + this.BLADE_WIDTH; x += this.BLADE_WIDTH) {
        const bladeHeight = this.HEIGHT.sample(random.getFloat()) * height;
        const sway = this.SWAY.sample(random.getFloat());

        path.push(
            "Q",
            x - this.BLADE_WIDTH * .5,
            base - bladeHeight,
            x + sway * bladeHeight,
            base - bladeHeight,
            "Q",
            x,
            base - bladeHeight,
            x + this.BLADE_WIDTH * .5,
            base);
    }

    path.push("Z");

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