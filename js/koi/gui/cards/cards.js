/**
 * The cards visible on the GUI
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const Cards = function(element) {
    this.element = element;
    this.cards = [];
    this.mouse = null;
    this.grabbed = null;

    element.addEventListener("mousemove", event => {
        event.preventDefault();

        this.move(
            event.clientX,
            event.clientY);
    });

    element.addEventListener("touchmove", event => {
        event.preventDefault();

        this.move(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY);
    });

    element.addEventListener("mouseup", () => this.release());
    element.addEventListener("touchend", () => this.release());
};

/**
 * Move the mouse to a new position
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Cards.prototype.move = function(x, y) {
    if (this.grabbed) {
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;

        this.grabbed.move(dx, dy);

        this.mouse.x = x;
        this.mouse.y = y;
    }
};

/**
 * Grab a card
 * @param {Card} card The card that was grabbed
 * @param {Vector2} anchor The position relative to the card origin where it was grabbed
 */
Cards.prototype.grabCard = function(card, anchor) {
    this.grabbed = card;
    this.mouse = anchor;
};

/**
 * Release any current drag or swipe motion
 */
Cards.prototype.release = function() {
    this.grabbed = 0;
};

/**
 * Add a card to the cards
 * @param {Card} card A card
 */
Cards.prototype.add = function(card) {
    card.element.addEventListener("mousedown", event => this.grabCard(
        card,
        new Vector2(event.clientX, event.clientY)));

    card.element.addEventListener("touchStart", event => this.grabCard(
        card,
        new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY)));

    this.cards.push(card);
    this.element.appendChild(card.element);
};