/**
 * The loader icon
 * @constructor
 */
const LoaderIcon = function() {
    this.element = this.createElement();

    this.loadSVG();
};

LoaderIcon.prototype.ID = "loader-icon";
LoaderIcon.prototype.CLASS_INVISIBLE = "invisible";
LoaderIcon.prototype.FILE_ENGLISH = "svg/logo-english.svg";
LoaderIcon.prototype.FILE_JAPANESE = "svg/logo-japanese.svg";
LoaderIcon.prototype.FADE_IN_DELAY = .32;

/**
 * Get the appropriate file for a given locale
 * @param {String} locale The two letter locale string
 * @returns {String} A path to a file
 */
LoaderIcon.prototype.getFile = function(locale) {
    switch (locale) {
        case "ja":
            return this.FILE_JAPANESE;
        default:
            return this.FILE_ENGLISH;
    }
};

/**
 * Load the SVG image
 */
LoaderIcon.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        setTimeout(() => {
            this.element.classList.remove(this.CLASS_INVISIBLE);
        }, 1000 * this.FADE_IN_DELAY);
    };

    request.open("GET", this.getFile(chosenLocale), true);
    request.send();
};

/**
 * Create the element
 * @returns {HTMLDivElement} The element
 */
LoaderIcon.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;
    element.className = this.CLASS_INVISIBLE;

    return element;
};