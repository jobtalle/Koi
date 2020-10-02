/**
 * A koi card
 * @param {FishBody} body The fish body represented by this card
 * @param {Vector2} position The initial card position
 * @constructor
 */
const Card = function(body, position) {
    this.body = body;
    this.position = position;
    this.element = this.createElement();

    this.updatePosition();
};

Card.prototype.CLASS = "card";

/**
 * Move the card
 * @param {Number} dx The X delta
 * @param {Number} dy The Y delta
 */
Card.prototype.move = function(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;

    this.updatePosition();
};

/**
 * Update this cards element position
 */
Card.prototype.updatePosition = function() {
    this.element.style.left = this.position.x + "px";
    this.element.style.top = this.position.y + "px";
};

/**
 * Create an HTML element for this card
 * @returns {HTMLElement} The card element
 */
Card.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;

    return element;
};