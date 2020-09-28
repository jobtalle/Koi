/**
 * The HTML gui
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const GUI = function(element) {
    this.cards = new Cards(element);
};