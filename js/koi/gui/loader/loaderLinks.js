/**
 * A link to the website server
 * @constructor
 */
const LoaderLinks = function() {
    this.element = this.createElement();

    this.elementApple = new LoaderApple();
    this.elementAndroid = new LoaderAndroid();

    this.elementDiscord = new LoaderDiscord();
    this.elementWebsite = new LoaderWebsite();

    if (PLATFORM_NAME !== "android" && PLATFORM_NAME !== "ios") {
        this.element.appendChild(this.elementApple.element);
        this.element.appendChild(this.elementAndroid.element);
    }

    this.element.appendChild(this.elementWebsite.element);
    this.element.appendChild(this.elementDiscord.element);

    // this.loadSVG();
};

LoaderLinks.prototype.ID = "loader-links";
LoaderLinks.prototype.CLASS_INVISIBLE = "invisible";
// LoaderLinks.prototype.FILE = "svg/website.svg";
LoaderLinks.prototype.FADE_IN_DELAY = 2.5;
// LoaderLinks.prototype.URL = "https://koifarmgame.com";

/**
 * Load the SVG image
 */
LoaderLinks.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        setTimeout(() => {
            this.element.classList.remove(this.CLASS_INVISIBLE);
        }, 1000 * this.FADE_IN_DELAY);

        this.element.onclick = () => {
            if (window["require"]) {
                window["require"]("electron")["shell"]["openExternal"](this.URL);
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openLinksHandler) {
                window.webkit.messageHandlers.openLinksHandler.postMessage({discordURL: this.URL});
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
LoaderLinks.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;
    // element.className = this.CLASS_INVISIBLE;

    return element;
};
