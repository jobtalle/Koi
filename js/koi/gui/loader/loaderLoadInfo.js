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


/**
 * Load the SVG image
 */
LoaderLoadInfo.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.iconElement.innerHTML = request.responseText;

        // setTimeout(() => {
        //     this.element.classList.remove(this.CLASS_INVISIBLE);
        // }, 1000 * this.FADE_IN_DELAY);
    };

    request.open("GET", LoaderLoadInfo.prototype.FILE, true);
    request.send();
};

/**
 * Set the text
 */
LoaderLoadInfo.prototype.setText = function() {
    this.textElement.innerText = language.get("LOADING");
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

    // this.textElement.innerText = ;

    element.appendChild(this.iconElement);
    element.appendChild(this.textElement);

    return element;
};

LoaderLoadInfo.prototype.hide = function() {
    this.element.classList.add(LoaderLoadInfo.prototype.CLASS_INVISIBLE);
}