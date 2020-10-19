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
 * Set the koi object this GUI is linked to
 * @param {Koi} koi The koi object
 */
GUI.prototype.setKoi = function(koi) {
    this.cards.setKoi(koi);
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

/**
 * A function that checks whether the GUI overlays (and occupies) the screen
 * @returns {Boolean} True if the GUI is using the screen
 */
GUI.prototype.showsOverlay = function() {
    return this.cards.visible;
};

GUI.prototype.ID_CARDS = "cards";