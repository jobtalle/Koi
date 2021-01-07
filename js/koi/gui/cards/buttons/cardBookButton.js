/**
 * A card book button
 * @param {Function} onClick The function to execute on click
 * @constructor
 */
const CardBookButton = function(onClick) {
    this.element = this.makeElement(onClick);
};

CardBookButton.prototype.ID = "button-book";
CardBookButton.prototype.GRADIENT_ID = "button-book-gradient";
CardBookButton.prototype.CLASS_PAGE = "page";
CardBookButton.prototype.CLASS_SIDE = "side";
CardBookButton.prototype.WIDTH = 10;
CardBookButton.prototype.HEIGHT = 10;
CardBookButton.prototype.PADDING_X = 0;
CardBookButton.prototype.PADDING_Y = 2;
CardBookButton.prototype.CONTROL_SPINE_X = 2;
CardBookButton.prototype.CONTROL_SPINE_Y = -2;
CardBookButton.prototype.CONTROL_X = 3;
CardBookButton.prototype.THICKNESS = .6;
CardBookButton.prototype.COLOR_PAGE = Color.fromCSS("--book-page-color");
CardBookButton.prototype.COLOR_PAGE_SHADE = Color.fromCSS("--book-page-color-shade");

/**
 * Create the SVG icon
 * @returns {SVGSVGElement} The SVG element
 */
CardBookButton.prototype.makeIcon = function() {
    const svg = SVG.createElement();
    const bezierRight = [
        "c",
        this.CONTROL_SPINE_X,
        this.CONTROL_SPINE_Y,
        this.WIDTH * .5 - this.PADDING_X - this.CONTROL_X,
        0,
        this.WIDTH * .5 - this.PADDING_X,
        0];
    const bezierRightReversed = [
        "c",
        -this.CONTROL_X,
        0,
        -(this.WIDTH * .5 - this.PADDING_X) + this.CONTROL_SPINE_X,
        this.CONTROL_SPINE_Y,
        -(this.WIDTH * .5 - this.PADDING_X),
        0];
    const bezierLeft = [
        "c",
        this.CONTROL_X,
        0,
        this.WIDTH * .5 - this.PADDING_X - this.CONTROL_SPINE_X,
        this.CONTROL_SPINE_Y,
        this.WIDTH * .5 - this.PADDING_X,
        0
    ];
    const bezierLeftReversed = [
        "c",
        -this.CONTROL_SPINE_X,
        this.CONTROL_SPINE_Y,
        -(this.WIDTH * .5 - this.PADDING_X) + this.CONTROL_X,
        0,
        -(this.WIDTH * .5 - this.PADDING_X),
        0
    ];
    const pages = SVG.createPath([
        "M",
        this.WIDTH * .5,
        this.HEIGHT - this.PADDING_Y,
        ...bezierRight,
        "L",
        this.WIDTH - this.PADDING_X,
        this.PADDING_Y,
        ...bezierRightReversed,
        ...bezierLeftReversed,
        "L",
        this.PADDING_X,
        this.HEIGHT - this.PADDING_Y,
        ...bezierLeft,
        "Z"
    ]);
    const side = SVG.createPath([
        "M",
        this.WIDTH * .5,
        this.HEIGHT - this.PADDING_Y + this.THICKNESS * .5,
        ...bezierRight,
        "L",
        this.WIDTH - this.PADDING_X,
        this.HEIGHT - this.PADDING_Y - this.THICKNESS * .5,
        ...bezierRightReversed,
        ...bezierLeftReversed,
        "L",
        this.PADDING_X,
        this.HEIGHT - this.PADDING_Y + this.THICKNESS * .5,
        ...bezierLeft,
        "Z"
    ]);
    const defs = SVG.createDefs();
    const gradient = SVG.createHorizontalGradient(
        [0, .5, .5, 1],
    [this.COLOR_PAGE_SHADE, this.COLOR_PAGE, this.COLOR_PAGE_SHADE, this.COLOR_PAGE]);

    SVG.setId(gradient, this.GRADIENT_ID);
    SVG.setClass(pages, this.CLASS_PAGE);
    SVG.setFill(pages, this.GRADIENT_ID);
    SVG.setClass(side, this.CLASS_SIDE);

    defs.appendChild(gradient);
    svg.appendChild(defs);
    svg.appendChild(pages);
    svg.appendChild(side);

    SVG.setViewBox(svg, 0, 0, this.WIDTH, this.HEIGHT);

    return svg;
};

/**
 * Make the button element
 * @param {Function} onClick The function to execute on click
 * @returns {HTMLButtonElement} The button element
 */
CardBookButton.prototype.makeElement = function(onClick) {
    const element = document.createElement("button");

    element.onclick = onClick;
    element.id = this.ID;

    element.appendChild(this.makeIcon());

    return element;
};