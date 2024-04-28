/**
 * A link to the website server
 * @constructor
 */
const LoaderWebsite = function() {
    this.element = this.createElement();
    try {
        LoaderWebsite.prototype.URL += "&referrer=" + encodeURIComponent(PLATFORM_NAME);
    } catch (e) {
    }

    this.loadSVG();
};

LoaderWebsite.prototype.ID = "loader-website";
LoaderWebsite.prototype.CLASS = "loader-icon";
LoaderWebsite.prototype.CLASS_INVISIBLE = "invisible";
LoaderWebsite.prototype.FILE = "svg/website.svg";
LoaderWebsite.prototype.FADE_IN_DELAY = 2.5;
LoaderWebsite.prototype.URL = "https://koifarmgame.com?source=KoiGame";

/**
 * Load the SVG image
 */
LoaderWebsite.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        setTimeout(() => {
            this.element.classList.remove(this.CLASS_INVISIBLE);
        }, 1000 * this.FADE_IN_DELAY);

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
LoaderWebsite.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;
    element.className = this.CLASS_INVISIBLE;
    element.classList.add(this.CLASS);

    return element;
};
