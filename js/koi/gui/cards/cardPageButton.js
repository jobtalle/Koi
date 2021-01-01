/**
 * A card page button
 * @param {Boolean} right True if this button points towards the right
 * @param {Function} onClick The function to execute on click
 * @constructor
 */
const CardPageButton = function(right, onClick) {
    this.element = this.makeElement(right, onClick);
};

CardPageButton.prototype.CLASS = "button-page";
CardPageButton.prototype.CLASS_LEFT = "left";
CardPageButton.prototype.CLASS_RIGHT = "right";
CardPageButton.prototype.CLASS_DISABLED = "disabled";
CardPageButton.prototype.CLASS_LOCKED = "locked";

/**
 * Set whether this button should be disabled
 * @param {Boolean} disabled True if the button should be disabled
 */
CardPageButton.prototype.setDisabled = function(disabled) {
    if (disabled)
        this.element.classList.add(this.CLASS_DISABLED);
    else
        this.element.classList.remove(this.CLASS_DISABLED);
};

/**
 * Set the satisfied state of a button
 * @param {Number} required The number of card slots that need to be filled for this button
 * @param {Number} satisfied The amount of satisfied card slots
 */
CardPageButton.prototype.setSatisfied = function(required, satisfied) {
    if (satisfied < required) {
        this.element.classList.add(this.CLASS_LOCKED);
        this.element.innerText = satisfied.toString() + "/" + required.toString();
    }
    else {
        this.element.classList.remove(this.CLASS_LOCKED);
        this.element.innerText = "";
    }
};

/**
 * Set this button to unlocked
 */
CardPageButton.prototype.setUnlocked = function() {
    this.element.classList.remove(this.CLASS_LOCKED);
    this.element.innerText = "";
};

/**
 * Make the button element
 * @param {Boolean} right True if this button points towards the right
 * @param {Function} onClick The function to execute on click
 * @returns {HTMLButtonElement} The button element
 */
CardPageButton.prototype.makeElement = function(right, onClick) {
    const element = document.createElement("button");

    element.onclick = onClick;
    element.className = this.CLASS;

    if (right)
        element.classList.add(this.CLASS_RIGHT);
    else
        element.classList.add(this.CLASS_LEFT);

    return element;
};