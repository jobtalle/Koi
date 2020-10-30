/**
 * The cards visible on the GUI
 * @param {HTMLDivElement} element The root element for the GUI
 * @constructor
 */
const Cards = function(element) {
    this.element = element;
    this.dropTarget = this.createDropTarget();
    this.book = new CardBook(element.clientWidth, element.clientHeight);
    this.hand = new CardHand(element.clientWidth, element.clientHeight, this.dropTarget);
    this.cards = [];
    this.grabbed = null;
    this.grabOffset = new Vector2();
    this.snap = null;
    this.bookVisible = false;
    this.hidden = false; // TODO: Use for pausing card animations
    this.hideTimer = 0;
    this.koi = null;

    element.appendChild(this.createButtonBook());
    element.appendChild(this.book.element);
    element.appendChild(this.dropTarget);

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
Cards.prototype.HIDE_TIME = 10;
Cards.prototype.FISH_DROP_DIRECTION = new Vector2(1, 0);
Cards.prototype.ID_BUTTON_BOOK = "button-book";
Cards.prototype.ID_DROP_TARGET = "drop-target";
Cards.prototype.CLASS_DROP_TARGET = "card-shape hidden";
Cards.prototype.DROP_TARGET_THRESHOLD = .2;

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
 * Create the card drop target element
 * @returns {HTMLDivElement} The drop target element
 */
Cards.prototype.createDropTarget = function() {
    const element = document.createElement("div");

    element.id = this.ID_DROP_TARGET;
    element.className = this.CLASS_DROP_TARGET;

    return element;
};

/**
 * Create the button that pulls up the book GUI
 * @returns {HTMLButtonElement} The book button element
 */
Cards.prototype.createButtonBook = function() {
    const element = document.createElement("button");

    element.id = this.ID_BUTTON_BOOK;
    element.onclick = () => {
        if (this.bookVisible)
            this.hide();
        else
            this.show();
    };

    return element;
};

/**
 * Check whether a card element is on the drop target
 * @param {Card} card A card
 * @returns {Boolean} True if a card is on the drop target
 */
Cards.prototype.cardOnDropTarget = function(card) {
    const rectCard = card.element.getBoundingClientRect();
    const rectDropTarget = this.dropTarget.getBoundingClientRect();
    const left = Math.max(rectCard.left, rectDropTarget.left);
    const top = Math.max(rectCard.top, rectDropTarget.top);
    const right = Math.min(rectCard.right, rectDropTarget.right);
    const bottom = Math.min(rectCard.bottom, rectDropTarget.bottom);
    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);

    return (width * height) / (Card.prototype.WIDTH * Card.prototype.HEIGHT) > this.DROP_TARGET_THRESHOLD;
};

/**
 * Check whether a point is inside the drop target
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Boolean} True if the point is inside the drop target
 */
Cards.prototype.onDropTarget = function(x, y) {
    const rect = this.dropTarget.getBoundingClientRect();

    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
};

/**
 * Move a card to the drop target position
 * @param {Card} card The card to move
 */
Cards.prototype.toDropTarget = function(card) {
    const rectDropTarget = this.dropTarget.getBoundingClientRect();
    const x = (rectDropTarget.right + rectDropTarget.left) * .5;
    const y = (rectDropTarget.bottom + rectDropTarget.top) * .5;

    card.moveTo(x, y);
};

/**
 * Set the koi object this GUI is linked to
 * @param {Koi} koi The koi object
 */
Cards.prototype.setKoi = function(koi) {
    this.koi = koi;
};

/**
 * Find a point to snap to
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
Cards.prototype.findSnap = function(x, y) {
    if (!this.bookVisible)
        return null;

    return this.book.findSnap(x, y);
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
    if (!this.bookVisible && --this.hideTimer === 0)
        this.hidden = true;

    this.hand.update();
    this.book.update();

    if (this.grabbed)
        this.grabbed.rotate(0, this.INTERPOLATION_FACTOR);
};

/**
 * Render the cards GUI
 * @param {Number} time The amount of time since the last update
 */
Cards.prototype.render = function(time) {
    this.hand.render(time);
    this.book.render(time);

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
        this.snap = this.findSnap(x, y);

        this.grabbed.moveTo(x - this.grabOffset.x, y - this.grabOffset.y);
    }
};

/**
 * Grab a card
 * @param {Card} card The card that was grabbed
 * @param {Number} x The mouse X position in pixels
 * @param {Number} y The mouse Y position in pixels
 */
Cards.prototype.grabCard = function(card, x, y) {
    if (this.hand.contains(card)) {
        this.hand.remove(card);
        this.moveToFront(card);

        if (!this.bookVisible) {
            this.hand.hide();

            this.remove(card);

            const worldX = this.koi.constellation.getWorldX(x, this.koi.scale);
            const worldY = this.koi.constellation.getWorldY(y, this.koi.scale);
            const fish = new Fish(
                    card.body,
                    new Vector2(worldX, worldY),
                    this.FISH_DROP_DIRECTION);
            const origin = fish.body.getOffspringPosition();

            fish.moveTo(new Vector2(worldX * 2 - origin.x, worldY * 2 - origin.y));

            this.koi.systems.atlas.write(card.body.pattern, this.koi.randomSource);
            this.koi.mover.pickUp(fish, worldX, worldY);
        }
    }
    else
        this.removeFromBook(card);

    if (this.bookVisible) {
        this.grabbed = card;
        this.grabOffset.x = x - card.position.x;
        this.grabOffset.y = y - card.position.y;
        this.snap = this.findSnap(x, y);
        this.element.style.pointerEvents = "auto";
    }
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

        if (this.bookVisible) {
            if (this.snap)
                this.addToBook(this.grabbed, this.snap);
            else
                this.hand.addCardsAfter(this.element, this.hand.add(this.grabbed));
        }
        else if (this.cardOnDropTarget(this.grabbed)) {
            this.toDropTarget(this.grabbed);

            this.hand.addCardsAfter(this.element, this.hand.add(this.grabbed));
        }

        this.grabbed = null;
        this.hand.show();
    }
};

/**
 * Register a card on the cards GUI
 * @param {Card} card A card
 * @param {Boolean} [addToGUI] True if the card element should be added to the GUI
 */
Cards.prototype.registerCard = function(card, addToGUI = true) {
    card.element.addEventListener("mousedown", event => {
        if (event.button === 0)
            this.grabCard(
                card,
                event.clientX,
                event.clientY);
    });

    card.element.addEventListener("touchstart", event => this.grabCard(
            card,
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY));

    card.element.addEventListener("touchmove", event => {
        event.preventDefault();

        this.koi.touchMove(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY);
    });

    card.element.addEventListener("touchend", this.koi.touchEnd.bind(this.koi));

    this.cards.push(card);

    if (addToGUI)
        this.element.appendChild(card.element);
};

/**
 * Add a card to the cards
 * @param {Card} card A card
 */
Cards.prototype.add = function(card) {
    this.registerCard(card);

    this.hand.add(card, false);
};

/**
 * Remove a card from the cards
 * @param {Card} card A card
 */
Cards.prototype.remove = function(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    this.element.removeChild(card.element);
};

/**
 * Hide the cards GUI
 */
Cards.prototype.hide = function() {
    if (this.bookVisible) {
        this.book.hide();

        this.hideTimer = this.HIDE_TIME;
        this.bookVisible = false;
    }
};

/**
 * Show the cards GUI
 */
Cards.prototype.show = function() {
    if (!this.bookVisible) {
        this.book.show();

        this.bookVisible = true;
        this.hidden = false;
    }
}