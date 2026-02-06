/**
 * A card load button
 * @param {Function} onClick The function to execute on click
 * @constructor
 */
const CardLoadButton = function(onClick) {
    this.element = this.makeElement(onClick);
};

CardLoadButton.prototype.ID = "button-load-card";
CardLoadButton.prototype.FILE = "svg/add.svg";
CardLoadButton.prototype.WIDTH = 10;
CardLoadButton.prototype.HEIGHT = 10;


CardLoadButton.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;
    };

    request.open("GET", this.FILE, true);
    request.send();
}


/**
 * Make the button element
 * @param {Function} onClick The function to execute on click
 * @returns {HTMLButtonElement} The button element
 */
CardLoadButton.prototype.makeElement = function(onClick) {
    const element = document.createElement("button");

    element.onclick = onClick;
    element.id = this.ID;

    this.loadSVG();

    return element;
};