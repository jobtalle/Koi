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
 * Serialize the GUI
 * @param {BinBuffer} buffer The buffer to deserialize form
 * @throws {RangeError} A range error if deserialized values are not valid
 */
GUI.prototype.deserialize = function(buffer) {
    this.cards.deserialize(buffer);
};

/**
 * Serialize the GUI
 * @param {BinBuffer} buffer The buffer to serialize to
 */
GUI.prototype.serialize = function(buffer) {
    this.cards.serialize(buffer);
};

/**
 * This function should be called whenever the game (not the GUI) is interacted with
 */
GUI.prototype.interactGame = function() {
    this.cards.hide();
};

/**
 * Clear the GUI contents
 */
GUI.prototype.clear = function() {
    this.cards.clear();
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