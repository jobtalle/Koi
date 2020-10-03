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

/**
 * Indicate that the GUI has resized
 */
GUI.prototype.resize = function() {
    this.cards.resize();
};

/**
 * Update the GUI
 */
GUI.prototype.update = function() {
    this.cards.update();
};

/**
 * Render the GUI
 * @param {Number} time The amount of time since the last update
 */
GUI.prototype.render = function(time) {
    this.cards.render(time);
};

GUI.prototype.ID_CARDS = "cards";