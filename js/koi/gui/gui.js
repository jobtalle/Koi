/**
 * The HTML gui
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const GUI = function(element) {
    const elementCards = document.createElement("div");

    elementCards.id = this.ID_CARDS;

    element.appendChild(elementCards);

    this.cards = new Cards(elementCards);
};

GUI.prototype.ID_CARDS = "cards";