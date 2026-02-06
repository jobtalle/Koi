/**
 * A card menu button
 * @param {Function} onClick The function to execute on click
 * @constructor
 */
const CardMenuButton = function(onClick) {
    this.element = this.makeElement(onClick);
};

CardMenuButton.prototype.ID = "button-home";
CardMenuButton.prototype.FILE = "svg/settings.svg";
CardMenuButton.prototype.WIDTH = 10;
CardMenuButton.prototype.HEIGHT = 10;


CardMenuButton.prototype.loadSVG = function() {
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
CardMenuButton.prototype.makeElement = function(onClick) {
    const element = document.createElement("button");

    element.onclick = onClick;
    element.id = this.ID;
    
    this.loadSVG();

    return element;
};