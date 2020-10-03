/**
 * A koi card
 * @param {FishBody} body The fish body represented by this card
 * @param {Vector2} position The initial card position
 * @constructor
 */
const Card = function(body, position) {
    this.body = body;
    this.position = position;
    this.positionPrevious = position.copy();
    this.element = this.createElement();

    this.updatePosition();
};

Card.prototype.CLASS = "card";

/**
 * Render the card, updates every refresh
 * @param {Number} time The amount of time since the last update
 */
Card.prototype.render = function(time) {
    this.updatePosition(time);
};

/**
 * Move the card
 * @param {Number} dx The X delta
 * @param {Number} dy The Y delta
 */
Card.prototype.move = function(dx, dy) {
    this.positionPrevious.set(this.position);

    this.position.x += dx;
    this.position.y += dy;
};

/**
 * Move the card instantly without interpolation
 * @param {Number} dx The X delta
 * @param {Number} dy The Y delta
 */
Card.prototype.shift = function(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
    this.positionPrevious.set(this.position);

    this.updatePosition();
};

/**
 * Update this cards element position
 * @param {Number} time The amount of time since the last update
 */
Card.prototype.updatePosition = function(time = 0) {
    const x = this.positionPrevious.x + (this.position.x - this.positionPrevious.x) * time;
    const y = this.positionPrevious.y + (this.position.y - this.positionPrevious.y) * time;

    this.element.style.left = Math.round(x) + "px";
    this.element.style.top = Math.round(y) + "px";
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