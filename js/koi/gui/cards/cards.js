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

    this.functionOnMouseMove = event => {
        this.move(
            event.clientX,
            event.clientY);
    };

    this.functionOnTouchMove = event => {
        event.preventDefault();

        this.move(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY);
    };
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

    this.moveToFront(card);
};

/**
 * Move a card to the front
 * @param {Card} card A card that exists in the cards system
 */
Cards.prototype.moveToFront = function(card) {
    this.element.removeChild(card.element);
    this.element.appendChild(card.element);
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

    card.element.addEventListener("touchstart", event => this.grabCard(
        card,
        new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY)));

    card.element.addEventListener("mousemove", this.functionOnMouseMove);
    card.element.addEventListener("touchmove", this.functionOnTouchMove);
    card.element.addEventListener("mouseup", this.release.bind(this));
    card.element.addEventListener("touchend", this.release.bind(this));
    card.element.addEventListener("mouseleave", this.release.bind(this));

    this.cards.push(card);
    this.element.appendChild(card.element);
};