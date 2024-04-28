/**
 * A link to the website server
 * @constructor
 */
const LoaderAndroid = function () {
    this.element = this.createElement();

    this.loadSVG();
};

LoaderAndroid.prototype.ID = "loader-android";
LoaderAndroid.prototype.CLASS = "loader-bar";
LoaderAndroid.prototype.CLASS_INVISIBLE = "invisible";
LoaderAndroid.prototype.FILE = "svg/Google_Play_Store_badge_EN_WHITE.svg";
LoaderAndroid.prototype.FADE_IN_DELAY = 2.5;
LoaderAndroid.prototype.URL = "https://play.google.com/store/apps/details?id=com.koifarmgame&utm_source=KoiGame&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1";
/**
 * Load the SVG image
 */
LoaderAndroid.prototype.loadSVG = function () {
    const request = new XMLHttpRequest();

    request.onload = () => {
        this.element.innerHTML = request.responseText;

        // setTimeout(() => {
        //     this.element.classList.remove(this.CLASS_INVISIBLE);
        // }, 1000 * this.FADE_IN_DELAY);

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

LoaderAndroid.prototype.setInvisible = function () {
    this.element.classList.add(this.CLASS_INVISIBLE);
}

LoaderAndroid.prototype.setVisible = function () {
    this.element.classList.remove(this.CLASS_INVISIBLE);
}

/**
 * Create the element
 * @returns {HTMLDivElement} The element
 */
LoaderAndroid.prototype.createElement = function () {
    const element = document.createElement("div");

    element.id = this.ID;
    // element.className = this.CLASS_INVISIBLE;
    element.classList.add(this.CLASS);

    return element;
};
