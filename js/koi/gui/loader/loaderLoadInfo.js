/**
 * The loader load info
 * @constructor
 */
const LoaderLoadInfo = function() {
    this.iconElement = document.createElement("div");
    this.textElement = document.createElement("div");
    this.element = this.createElement();


    this.loadSVG();
};

LoaderLoadInfo.prototype.ID = "loader-loading";
LoaderLoadInfo.prototype.TEXT_ID = "loader-loading-text";
LoaderLoadInfo.prototype.ICON_ID = "loader-loading-icon";
LoaderLoadInfo.prototype.TEXT = "LOADING";
LoaderLoadInfo.prototype.CLASS_INVISIBLE = "invisible";
LoaderLoadInfo.prototype.FILE = "svg/butterfly.svg";
LoaderLoadInfo.prototype.FADE_IN_DELAY = .32;
LoaderLoadInfo.prototype.LOADING_TEXT = "LOADING";


/**
 * Load the SVG image
 */
LoaderLoadInfo.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.iconElement.innerHTML = request.responseText;
    };

    request.open("GET", LoaderLoadInfo.prototype.FILE, true);
    request.send();
};

/**
 * Set the text
 * @param {String} text The text, or null to use the default text
 */
LoaderLoadInfo.prototype.setText = function(text = null) {
    if (text)
        this.textElement.innerText = text;
    else
        this.textElement.innerText = language.get(LoaderLoadInfo.prototype.LOADING_TEXT);
}

/**
 * Create the element
 * @returns {HTMLDivElement} The element
 */
LoaderLoadInfo.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;

    this.iconElement.id = this.ICON_ID;
    this.textElement.id = this.TEXT_ID;

    element.appendChild(this.iconElement);
    element.appendChild(this.textElement);

    return element;
};

LoaderLoadInfo.prototype.hide = function() {
    this.element.classList.add(LoaderLoadInfo.prototype.CLASS_INVISIBLE);
}