/**
 * A single sided page with cards
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @constructor
 */
const CardPage = function(direction) {
    this.cards = new Array(4).fill(null);
    this.element = this.createElement(direction);
    this.slots = this.createSlots(this.element);
};

CardPage.prototype.CLASS = "page";
CardPage.prototype.CLASS_SLOT = "slot";
CardPage.prototype.CLASS_LEFT = "left";
CardPage.prototype.CLASS_RIGHT = "right";

/**
 * Create a page element
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @returns {HTMLDivElement} The element
 */
CardPage.prototype.createElement = function(direction) {
    const element = document.createElement("div");

    element.className = this.CLASS;

    if (direction === -1)
        element.classList.add(this.CLASS_LEFT);
    else
        element.classList.add(this.CLASS_RIGHT);

    return element;
};

/**
 * Create the card slots
 * @param {HTMLDivElement} element The page element
 * @returns {HTMLDivElement[]} The card slot elements
 */
CardPage.prototype.createSlots = function(element) {
    const slots = new Array(4);

    for (let slot = 0; slot < 4; ++slot) {
        const slotElement = document.createElement("div");

        slotElement.className = this.CLASS_SLOT;

        slots[slot] = slotElement;

        element.appendChild(slotElement);
    }

    return slots;
};

/**
 * Fit the card page contents to a given resolution
 * @param {Number} cardWidth The card width in pixels
 * @param {Number} cardHeight The card height in pixels
 * @param {Number} cardPadding The card padding in pixels
 */
CardPage.prototype.fit = function(cardWidth, cardHeight, cardPadding) {
    this.element.style.width = (cardWidth * 2 + cardPadding * 3) + "px";
    this.element.style.height = (cardHeight * 2 + cardPadding * 3) + "px";

    for (const slot of this.slots) {
        slot.style.width = cardWidth + "px";
        slot.style.height = cardHeight + "px";
    }
};