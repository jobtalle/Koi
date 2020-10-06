/**
 * The cards visible on the GUI
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const Cards = function(element) {
    this.element = element;
    this.hand = new CardHand(element.clientWidth, element.clientHeight);
    this.book = null;
    this.cards = [];
    this.mouse = null;
    this.grabbed = null;
    this.visible = false;

    element.addEventListener("mousemove", event => {
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

    element.addEventListener("mouseup", this.release.bind(this));
    element.addEventListener("touchend", this.release.bind(this));
    element.addEventListener("mouseleave", this.release.bind(this));
};

/**
 * Serialize the card collection
 * @param {BinBuffer} buffer The buffer to deserialize form
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Cards.prototype.deserialize = function(buffer) {
    this.hand.deserialize(buffer, this);
};

/**
 * Serialize the card collection
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Cards.prototype.serialize = function(buffer) {
    this.hand.serialize(buffer);
};

/**
 * Clear the cards GUI
 */
Cards.prototype.clear = function() {
    this.hand.clear();

    for (const card of this.cards)
        this.element.removeChild(card.element);

    this.cards = [];
};

/**
 * Indicate that the GUI has resized
 */
Cards.prototype.resize = function() {
    this.hand.resize(this.element.clientWidth, this.element.clientHeight);
};

/**
 * Update the cards GUI
 */
Cards.prototype.update = function() {
    this.hand.update();
};

/**
 * Render the cards GUI
 * @param {Number} time The amount of time since the last update
 */
Cards.prototype.render = function(time) {
    this.hand.render(time);
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

        this.grabbed.shift(dx, dy);

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
    this.element.style.pointerEvents = "auto";

    this.moveToFront(card);

    if (this.hand.contains(card))
        this.hand.remove(card);
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
    if (this.grabbed) {
        this.element.style.pointerEvents = "none";

        this.hand.add(this.grabbed);

        this.grabbed = null;
    }
};

/**
 * Register a card on the cards GUI
 * @param {Card} card A card
 */
Cards.prototype.registerCard = function(card) {
    card.element.addEventListener("mousedown", event => this.grabCard(
        card,
        new Vector2(event.clientX, event.clientY)));

    card.element.addEventListener("touchstart", event => this.grabCard(
        card,
        new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY)));

    this.cards.push(card);
    this.element.appendChild(card.element);
};

/**
 * Add a card to the cards
 * @param {Card} card A card
 */
Cards.prototype.add = function(card) {
    this.hand.add(card);

    this.registerCard(card);
};