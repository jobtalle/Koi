/**
 * The cards visible on the GUI
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const Cards = function(element) {
    this.element = element;
    this.cards = [];
};

/**
 * Add a card to the cards
 * @param {Card} card A card
 */
Cards.prototype.add = function(card) {
    this.cards.push(card);
    this.element.appendChild(card.createElement());
};