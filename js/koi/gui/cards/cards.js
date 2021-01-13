/**
 * The cards visible on the GUI
 * @param {HTMLDivElement} element The root element for the GUI
 * @param {CodeViewer} codeViewer The code viewer
 * @constructor
 */
const Cards = function(element, codeViewer) {
    this.element = element;
    this.codeViewer = codeViewer;
    this.dropTarget = this.createDropTarget();
    this.buttonBook = new CardBookButton(this.toggleBook.bind(this));
    this.book = new CardBook(element.clientWidth, element.clientHeight, this, () => {
        if (this.koi)
            this.koi.onUnlock();
    });
    this.hand = new CardHand(element.clientWidth, element.clientHeight, this.dropTarget);
    this.cards = [];
    this.grabbed = null;
    this.grabOffset = new Vector2();
    this.snap = null;
    this.bookVisible = false;
    this.hidden = false;
    this.hideTimer = 0;
    this.koi = null;

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
Cards.prototype.ID_DROP_TARGET = "drop-target";
Cards.prototype.CLASS_DROP_TARGET = "card-shape hidden";

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
 * Toggle the book
 */
Cards.prototype.toggleBook = function() {
    if (this.bookVisible)
        this.hide();
    else
        this.show();
};

/**
 * Enable the book button
 */
Cards.prototype.enableBookButton = function() {
    this.element.appendChild(this.buttonBook.element);
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
 * @param {FishBody} body The body to find a snap for
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
Cards.prototype.findSnap = function(x, y, body) {
    if (!this.bookVisible)
        return null;

    return this.book.findSnap(x, y, body);
};

/**
 * Clear the cards GUI
 */
Cards.prototype.clear = function() {
    this.hand.clear(this);
    this.book.clear(this);

    if (this.grabbed) {
        this.remove(this.grabbed);

        this.grabbed = null;
    }

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
 * Convert the currently dragged card to a fish
 * @param {Number} x The mouse X position in pixels
 * @param {Number} y The mouse Y position in pixels
 * @returns {Boolean} True if conversion succeeded
 */
Cards.prototype.convertToFish = function(x, y) {
    if (this.koi.constellation.getFishCount() < Koi.prototype.FISH_CAPACITY - 1) {
        this.hand.hide();

        this.remove(this.grabbed);

        const worldX = this.koi.constellation.getWorldX(x, this.koi.scale);
        const worldY = this.koi.constellation.getWorldY(y, this.koi.scale);
        const fish = new Fish(
            this.grabbed.body,
            new Vector2(worldX, worldY),
            this.FISH_DROP_DIRECTION);
        const origin = fish.body.getOffspringPosition();

        fish.moveTo(new Vector2(worldX * 2 - origin.x, worldY * 2 - origin.y));

        this.koi.systems.atlas.write(this.grabbed.body.pattern, this.koi.systems.randomSource);
        this.koi.mover.pickUp(fish, worldX, worldY);

        return true;
    }

    return false;
};

/**
 * Move the mouse to a new position
 * @param {Number} x The mouse X position in pixels
 * @param {Number} y The mouse Y position in pixels
 */
Cards.prototype.move = function(x, y) {
    if (this.grabbed) {
        if (!this.bookVisible && this.hand.isOutside(this.grabbed.position.x, this.grabbed.position.y)) {
            if (this.convertToFish(x, y)) {
                this.element.style.pointerEvents = "none";
                this.grabbed = null;
            }
        }
        else {
            this.snap = this.findSnap(x, y, this.grabbed.body);

            this.grabbed.moveTo(x - this.grabOffset.x, y - this.grabOffset.y);
        }
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
    }
    else {
        if (this.hand.isFull())
            return;

        this.removeFromBook(card);
    }

    this.grabbed = card;
    this.grabOffset.x = x - card.position.x;
    this.grabOffset.y = y - card.position.y;
    this.snap = this.findSnap(x, y, card.body);
    this.element.style.pointerEvents = "auto";
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
    this.koi.onStoreCard(card);
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
            this.hand.addCardsAfter(this.element, this.hand.add(this.grabbed));

        this.grabbed = null;
        this.hand.show();
    }
};

/**
 * Register a card on the cards GUI
 * @param {Card} card A card
 * @param {Boolean} [addToGUI] True if the card element should be added to the GUI
 * @param {Boolean} [initialize] True if the card must be initialized
 */
Cards.prototype.registerCard = function(card, addToGUI = true, initialize = false) {
    card.setCodeViewer(this.codeViewer);

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

    if (initialize || addToGUI)
        card.initialize(
            this.koi.systems.preview,
            this.koi.systems.atlas,
            this.koi.systems.bodies,
            this.koi.systems.randomSource);
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
 * @param {Boolean} [noChild] True if the card being removed is not a child of cards
 */
Cards.prototype.remove = function(card, noChild = false) {
    this.cards.splice(this.cards.indexOf(card), 1);

    if (!noChild)
        this.element.removeChild(card.element);

    card.free();
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