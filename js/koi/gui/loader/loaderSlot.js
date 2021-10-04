/**
 * A loader slot
 * @param {Number} index The slot index
 * @param {String} title The slot title
 * @param {Function} onNewGame Start a new game
 * @param {Function} onContinue Continue a game, null if that's not possible
 * @constructor
 */
const LoaderSlot = function(index, title, onNewGame, onContinue) {
    this.index = index;
    this.onNewGame = onNewGame;
    this.onContinue = onContinue;

    this.element = document.createElement("div");
    this.element.className = this.CLASS;
    this.element.appendChild(this.createTitle(title));

    if (onContinue)
        this.element.appendChild(this.createButtonContinue());

    this.element.appendChild(this.createButtonNew());
};

LoaderSlot.prototype.CLASS = "loader-slot loader-button";
LoaderSlot.prototype.LANG_CONTINUE = "CONTINUE";
LoaderSlot.prototype.LANG_NEW = "NEW";
LoaderSlot.prototype.LANG_CONFIRM = "CONFIRM";
LoaderSlot.prototype.CLASS_BUTTON_CONFIRM = "confirm";

/**
 * Create a title element
 * @param {String} title The title text
 * @returns {HTMLElement} The title element
 */
LoaderSlot.prototype.createTitle = function(title) {
    const element = document.createElement("h1");

    element.appendChild(document.createTextNode(title));

    return element;
};

/**
 * Create a continue button
 * @returns {HTMLButtonElement} The button
 */
LoaderSlot.prototype.createButtonContinue = function() {
    const element = document.createElement("button");

    element.innerText = language.get(this.LANG_CONTINUE);
    element.onclick = () => {
        this.onContinue(this.index);
    };

    return element;
};

/**
 * Create a new pond button
 * @returns {HTMLButtonElement} The button
 */
LoaderSlot.prototype.createButtonNew = function() {
    const element = document.createElement("button");

    element.innerText = language.get(this.LANG_NEW);
    element.addEventListener("mouseleave", () => {
        element.classList.remove(this.CLASS_BUTTON_CONFIRM);
        element.innerText = language.get(this.LANG_NEW);
    });

    element.onclick = () => {
        if (!this.onContinue || element.classList.contains(this.CLASS_BUTTON_CONFIRM))
            this.onNewGame(this.index);
        else {
            element.classList.add(this.CLASS_BUTTON_CONFIRM);
            element.innerText = language.get(this.LANG_CONFIRM);
        }
    };

    return element;
};