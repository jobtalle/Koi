/**
 * A card page button
 * @param {Boolean} right True if this button points towards the right
 * @param {Function} onClick The function to execute on click
 * @constructor
 */
const CardPageButton = function(right, onClick) {
    this.text = document.createElement("p");
    this.element = this.makeElement(this.text, right, onClick);
};

CardPageButton.prototype.WIDTH = 10;
CardPageButton.prototype.HEIGHT = 10;
CardPageButton.prototype.BORDER_RADIUS = 2;
CardPageButton.prototype.CLASS = "button-page";
CardPageButton.prototype.CLASS_LEFT = "left";
CardPageButton.prototype.CLASS_RIGHT = "right";
CardPageButton.prototype.CLASS_DISABLED = "disabled";
CardPageButton.prototype.CLASS_LOCKED = "locked";

/**
 * Set whether this button should be disabled
 * @param {Boolean} disabled True if the button should be disabled
 */
CardPageButton.prototype.setDisabled = function(disabled) {
    if (disabled)
        this.element.classList.add(this.CLASS_DISABLED);
    else
        this.element.classList.remove(this.CLASS_DISABLED);
};

/**
 * Set the satisfied state of a button
 * @param {Number} required The number of card slots that need to be filled for this button
 * @param {Number} satisfied The amount of satisfied card slots
 */
CardPageButton.prototype.setSatisfied = function(required, satisfied) {
    if (satisfied < required) {
        this.element.classList.add(this.CLASS_LOCKED);
        this.text.innerText = satisfied.toString() + "/" + required.toString();
    }
    else {
        this.element.classList.remove(this.CLASS_LOCKED);
        this.text.innerText = "";
    }
};

/**
 * Set this button to unlocked
 */
CardPageButton.prototype.setUnlocked = function() {
    this.element.classList.remove(this.CLASS_LOCKED);
    this.text.innerText = "";
};

/**
 * Create the SVG icon
 * @param {Boolean} right True if this button points towards the right
 * @returns {SVGSVGElement} The SVG element
 */
CardPageButton.prototype.makeIcon = function(right) {
    const angle = Math.atan(.5);
    const svg = SVG.createElement();
    const path = SVG.createPath(
        right ?
            [
                "M",
                0,
                this.BORDER_RADIUS,
                "A",
                this.BORDER_RADIUS,
                this.BORDER_RADIUS,
                0, 0, 1,
                this.BORDER_RADIUS + Math.cos(angle - Math.PI * .5) * this.BORDER_RADIUS,
                this.BORDER_RADIUS + Math.sin(angle - Math.PI * .5) * this.BORDER_RADIUS,
                "L",
                this.WIDTH - this.BORDER_RADIUS + Math.cos(angle - Math.PI * .5) * this.BORDER_RADIUS,
                this.HEIGHT * .5 + Math.sin(angle - Math.PI * .5) * this.BORDER_RADIUS,
                "A",
                this.BORDER_RADIUS,
                this.BORDER_RADIUS,
                0, 0, 1,
                this.WIDTH - this.BORDER_RADIUS + Math.cos(Math.PI * .5 - angle) * this.BORDER_RADIUS,
                this.HEIGHT * .5 + Math.sin(Math.PI * .5 - angle) * this.BORDER_RADIUS,
                "L",
                this.BORDER_RADIUS + Math.cos(Math.PI * .5 - angle) * this.BORDER_RADIUS,
                this.HEIGHT - this.BORDER_RADIUS + Math.sin(Math.PI * .5 - angle) * this.BORDER_RADIUS,
                "A",
                this.BORDER_RADIUS,
                this.BORDER_RADIUS,
                0, 0, 1,
                0,
                this.HEIGHT - this.BORDER_RADIUS,
                "Z"
            ] :
            [
                "M",
                this.WIDTH,
                this.BORDER_RADIUS,
                "A",
                this.BORDER_RADIUS,
                this.BORDER_RADIUS,
                0, 0, 0,
                this.WIDTH - this.BORDER_RADIUS + Math.cos(Math.PI * 1.5 - angle) * this.BORDER_RADIUS,
                this.BORDER_RADIUS + Math.sin(Math.PI * 1.5 - angle) * this.BORDER_RADIUS,
                "L",
                this.BORDER_RADIUS + Math.cos(Math.PI * 1.5 - angle) * this.BORDER_RADIUS,
                this.HEIGHT * .5 + Math.sin(Math.PI * 1.5 - angle) * this.BORDER_RADIUS,
                "A",
                this.BORDER_RADIUS,
                this.BORDER_RADIUS,
                0, 0, 0,
                this.BORDER_RADIUS + Math.cos(angle - Math.PI * 1.5) * this.BORDER_RADIUS,
                this.HEIGHT * .5 + Math.sin(angle - Math.PI * 1.5) * this.BORDER_RADIUS,
                "L",
                this.WIDTH - this.BORDER_RADIUS + Math.cos(angle - Math.PI * 1.5) * this.BORDER_RADIUS,
                this.HEIGHT - this.BORDER_RADIUS + Math.sin(angle - Math.PI * 1.5) * this.BORDER_RADIUS,
                "A",
                this.BORDER_RADIUS,
                this.BORDER_RADIUS,
                0, 0, 0,
                this.WIDTH,
                this.HEIGHT - this.BORDER_RADIUS,
                "Z"
            ]);

    SVG.setViewBox(svg, 0, 0, this.WIDTH, this.HEIGHT);

    svg.appendChild(path);

    return svg;
};

/**
 * Make the button element
 * @param {HTMLParagraphElement} text The text element
 * @param {Boolean} right True if this button points towards the right
 * @param {Function} onClick The function to execute on click
 * @returns {HTMLButtonElement} The button element
 */
CardPageButton.prototype.makeElement = function(text, right, onClick) {
    const element = document.createElement("button");
    const textContainer = document.createElement("div");

    textContainer.appendChild(text);

    element.onclick = onClick;
    element.className = this.CLASS;

    if (right)
        element.classList.add(this.CLASS_RIGHT);
    else
        element.classList.add(this.CLASS_LEFT);

    element.appendChild(this.makeIcon(right));
    element.appendChild(textContainer);

    return element;
};