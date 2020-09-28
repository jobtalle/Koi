/**
 * A koi card
 * @param {FishBody} body The fish body represented by this card
 * @constructor
 */
const Card = function(body) {
    this.body = body;
};

Card.prototype.CLASS = "card";

/**
 * Create an HTML element for this card
 * @returns {HTMLElement} The card element
 */
Card.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;

    return element;
};