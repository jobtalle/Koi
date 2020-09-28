/**
 * A koi card
 * @param {Fish} fish The fish represented by this card
 * @constructor
 */
const Card = function(fish) {

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