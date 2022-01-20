/**
 * A link to the discord server
 * @constructor
 */
const LoaderDiscord = function() {
    this.element = this.createElement();

    this.loadSVG();
};

LoaderDiscord.prototype.ID = "loader-discord";
LoaderDiscord.prototype.CLASS_INVISIBLE = "invisible";
LoaderDiscord.prototype.FILE = "svg/discord.svg";
LoaderDiscord.prototype.FADE_IN_DELAY = 2.5;
LoaderDiscord.prototype.URL = "https://discord.com/invite/bw3ZFe63Qg";

/**
 * Load the SVG image
 */
LoaderDiscord.prototype.loadSVG = function() {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        setTimeout(() => {
            this.element.classList.remove(this.CLASS_INVISIBLE);
        }, 1000 * this.FADE_IN_DELAY);

        this.element.onclick = () => {
            if (window["require"]) {
                window["require"]("electron")["shell"]["openExternal"](this.URL);
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openDiscordHandler) {
                window.webkit.messageHandlers.openDiscordHandler.postMessage({url: this.URL});
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
LoaderDiscord.prototype.createElement = function() {
    const element = document.createElement("div");

    element.id = this.ID;
    element.className = this.CLASS_INVISIBLE;

    return element;
};
