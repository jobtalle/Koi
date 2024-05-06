/**
 * A link to the website server
 * @constructor
 */
const LoaderApple = function() {
    this.element = this.createElement();

    this.loadSVG();
};

LoaderApple.prototype.ID = "loader-apple";
LoaderApple.prototype.CLASS = "loader-bar";
LoaderApple.prototype.CLASS_INVISIBLE = "invisible";
LoaderApple.prototype.FILE = "svg/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg";
LoaderApple.prototype.FADE_IN_DELAY = 2.5;
LoaderApple.prototype.URL = "https://apps.apple.com/app/koi-farm/id1607489625";

/**
 * Load the SVG image
 */
LoaderApple.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        this.element.onclick = () => {
            if (window["require"]) {
                window["require"]("electron")["shell"]["openExternal"](this.URL);
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openWebsiteHandler) {
                window.webkit.messageHandlers.openWebsiteHandler.postMessage({discordURL: this.URL});
            } else {
                window.open(this.URL, "_blank");
            }
        };
    };

    request.open("GET", this.FILE, true);
    request.send();
}

/**
 * Create the element
 * @returns {HTMLDivElement} The element
 */
LoaderApple.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;
    element.classList.add(this.CLASS);

    return element;
};
