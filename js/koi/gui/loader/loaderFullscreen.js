/**
 * The fullscreen toggle for the loader
 * @param {HTMLElement} wrapper The wrapper to toggle fullscreen on
 * @constructor
 */
const LoaderFullscreen = function(wrapper) {
    this.wrapper = wrapper;
    this.element = this.makeElement();
};

LoaderFullscreen.prototype.CLASS = "fullscreen";
LoaderFullscreen.prototype.CLASS_LOADED = "loaded";
LoaderFullscreen.prototype.CLASS_CORNERS = [
    "corner left-top",
    "corner right-top",
    "corner left-bottom",
    "corner right-bottom"];

/**
 * Create the element
 * @returns {HTMLDivElement} The HTML element
 */
LoaderFullscreen.prototype.makeElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;
    element.onclick = this.toggle.bind(this);

    for (let i = 0; i < 4; ++i) {
        const corner = document.createElement("div");

        corner.className = this.CLASS_CORNERS[i];

        element.appendChild(corner);
    }

    return element;
};

/**
 * Indicate loading has completed
 */
LoaderFullscreen.prototype.setLoaded = function() {
    this.element.classList.add(this.CLASS_LOADED);
};

/**
 * Toggle fullscreen
 */
LoaderFullscreen.prototype.toggle = function() {
    if (document.fullscreen)
        document.exitFullscreen();
    else
        this.wrapper.requestFullscreen();
};