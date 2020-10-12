/**
 * The cards visible on the GUI
 * @param {HTMLElement} element The root element for the GUI
 * @constructor
 */
const Cards = function(element) {
    this.element = element;
    this.book = new CardBook(element.clientWidth, element.clientHeight);
    this.hand = new CardHand(element.clientWidth, element.clientHeight);
    this.cards = [];
    this.mouse = null;
    this.grabbed = null;
    this.grabOffset = null;
    this.visible = false; // TODO: Implement
    this.snap = null;

    element.appendChild(this.book.element);

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

Cards.prototype.INTERPOLATION_FACTOR = .9;

/**
 * Serialize the card collection
 * @param {BinBuffer} buffer The buffer to deserialize form
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Cards.prototype.deserialize = function(buffer) {
    this.hand.deserialize(buffer, this);
    this.book.deserialize(buffer, this);
};

/**
 * Serialize the card collection
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Cards.prototype.serialize = function(buffer) {
    this.hand.serialize(buffer);
    this.book.serialize(buffer);
};

/**
 * Find a point to snap to
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
Cards.prototype.findSnap = function() {
    return this.book.findSnap(this.mouse);
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
    this.book.resize(this.element.clientWidth, this.element.clientHeight);
};

/**
 * Update the cards GUI
 */
Cards.prototype.update = function() {
    this.hand.update();

    if (this.grabbed) {
        this.grabbed.rotate(this.grabbed.angle * -this.INTERPOLATION_FACTOR);

        if (this.snap) {
            const dx = (this.snap.x - this.grabbed.position.x) * this.INTERPOLATION_FACTOR;
            const dy = (this.snap.y - this.grabbed.position.y) * this.INTERPOLATION_FACTOR;

            this.grabbed.move(dx, dy);
        }
        else {
            const dx = (this.mouse.x - this.grabOffset.x - this.grabbed.position.x) * this.INTERPOLATION_FACTOR;
            const dy = (this.mouse.y - this.grabOffset.y - this.grabbed.position.y) * this.INTERPOLATION_FACTOR;

            this.grabbed.move(dx, dy);
        }
    }
};

/**
 * Render the cards GUI
 * @param {Number} time The amount of time since the last update
 */
Cards.prototype.render = function(time) {
    this.hand.render(time);

    if (this.grabbed)
        this.grabbed.render(time);
};

/**
 * Move the mouse to a new position
 * @param {Number} x The mouse X position in pixels
 * @param {Number} y The mouse Y position in pixels
 */
Cards.prototype.move = function(x, y) {
    if (this.grabbed) {
        this.mouse.x = x;
        this.mouse.y = y;

        this.snap = this.findSnap();
    }
};

/**
 * Grab a card
 * @param {Card} card The card that was grabbed
 * @param {Vector2} mouse The mouse position
 */
Cards.prototype.grabCard = function(card, mouse) {
    this.grabbed = card;
    this.mouse = mouse;
    this.grabOffset = mouse.copy().subtract(card.position); // TODO: Account for rotation
    this.snap = this.findSnap();
    this.element.style.pointerEvents = "auto";

    card.stopMoving();

    if (this.hand.contains(card)) {
        this.hand.remove(card);
        this.moveToFront(card);
    }
    else
        this.removeFromBook(card);
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
 * Remove a card from the book
 * @param {Card} card The card
 */
Cards.prototype.removeFromBook = function(card) {
    this.book.removeFromBook(card);
    this.element.appendChild(card.element);
};

/**
 * Add a card to the book
 * @param {Card} card The card to add
 * @param {Vector2} snap The snap position on the book
 */
Cards.prototype.addToBook = function(card, snap) {
    this.element.removeChild(card.element);
    this.book.addToBook(card, snap);
};

/**
 * Release any current drag or swipe motion
 */
Cards.prototype.release = function() {
    if (this.grabbed) {
        this.element.style.pointerEvents = "none";

        if (this.snap)
            this.addToBook(this.grabbed, this.snap);
        else
            this.hand.add(this.grabbed);

        this.grabbed = null;
    }
};

/**
 * Register a card on the cards GUI
 * @param {Card} card A card
 * @param {Boolean} [addToGUI] True if the card element should be added to the GUI
 */
Cards.prototype.registerCard = function(card, addToGUI = true) {
    card.element.addEventListener("mousedown", event => this.grabCard(
        card,
        new Vector2(event.clientX, event.clientY)));

    card.element.addEventListener("touchstart", event => this.grabCard(
        card,
        new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY)));

    this.cards.push(card);

    if (addToGUI)
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