/**
 * The HTML gui
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const GUI = function(element) {
    const elementCards = document.createElement("div");
    const elementOverlay = document.createElement("div");

    elementCards.id = this.ID_CARDS;
    elementOverlay.id = this.ID_OVERLAY;

    element.appendChild(elementCards);
    element.appendChild(elementOverlay);

    this.cards = new Cards(elementCards);
    this.overlay = new Overlay(elementOverlay);
};

GUI.prototype.ID_CARDS = "cards";
GUI.prototype.ID_OVERLAY = "overlay";

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
 * Cancel any dragging action, called before unload
 */
GUI.prototype.cancelAction = function() {
    this.cards.release();
};

/**
 * Set the koi object this GUI is linked to
 * @param {Koi} koi The koi object
 */
GUI.prototype.setKoi = function(koi) {
    this.cards.setKoi(koi);
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
    this.overlay.render();
};