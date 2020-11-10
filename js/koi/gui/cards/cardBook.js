/**
 * A book with card pages
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @param {Cards} cards The cards object
 * @constructor
 */
const CardBook = function(width, height, cards) {
    this.spine = this.createSpine();
    this.element = this.createElement(this.spine);
    this.width = width;
    this.height = height;
    this.page = 0;
    this.pages = this.createPages(this.page);
    this.flips = [];
    this.flipDirection = 0;
    this.buttonPageLeft = this.createButtonPage(this.CLASS_BUTTON_LEFT, this.flipRight.bind(this));
    this.buttonPageRight = this.createButtonPage(this.CLASS_BUTTON_RIGHT, this.flipLeft.bind(this));
    this.cards = cards;

    this.populateSpine();

    this.element.appendChild(this.buttonPageLeft);
    this.element.appendChild(this.buttonPageRight);

    this.fit();
};

CardBook.prototype.ID = "book";
CardBook.prototype.ID_SPINE = "spine";
CardBook.prototype.CLASS_HIDDEN = "hidden";
CardBook.prototype.CLASS_BUTTON = "button-page";
CardBook.prototype.CLASS_BUTTON_LEFT = "left";
CardBook.prototype.CLASS_BUTTON_RIGHT = "right";
CardBook.prototype.PAGE_COUNT = 8;
CardBook.prototype.PADDING_TOP = .07;
CardBook.prototype.PADDING_PAGE = .07;
CardBook.prototype.PADDING_CARD = .05;
CardBook.prototype.HEIGHT = .65;

/**
 * A page flip action
 * @constructor
 */
CardBook.Flip = function() {
    this.flip = this.flipPrevious = 1;
    this.halfway = false;
};

CardBook.Flip.prototype.SPEED = .33;

/**
 * Update this flip
 * @returns {Boolean} True if the flip has finished
 */
CardBook.Flip.prototype.update = function() {
    this.flipPrevious = this.flip;

    if ((this.flip -= this.SPEED) < -1) {
        this.flip = -1;

        return true;
    }

    return false;
};

/**
 * Reverse this flip
 */
CardBook.Flip.prototype.reverse = function() {
    this.flipPrevious = -this.flipPrevious;
    this.flip = -this.flip;
    this.halfway = !this.halfway;
};

/**
 * Get the page scale produced by this flip
 * @param {Number} time The time factor
 * @returns {Number} The scale factor
 */
CardBook.Flip.prototype.getScale = function(time) {
    return Math.sin((this.flipPrevious + (this.flip - this.flipPrevious) * time) * Math.PI * .5);
};

/**
 * Deserialize the card book
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @param {Cards} cards The cards GUI
 * @throws {RangeError} A range error if deserialized values are not valid
 */
CardBook.prototype.deserialize = function(buffer, cards) {
    for (const page of this.pages)
        page.deserialize(buffer, cards);
};

/**
 * Serialize the card book
 * @param {BinBuffer} buffer The buffer to serialize to
 */
CardBook.prototype.serialize = function(buffer) {
    for (const page of this.pages)
        page.serialize(buffer);
};

/**
 * Remove all cards from this book
 * @param {Cards} cards The cards
 */
CardBook.prototype.clear = function(cards) {
    for (const page of this.pages)
        page.clear(cards);
};

/**
 * Add page elements to the spine
 */
CardBook.prototype.populateSpine = function() {
    let page;

    for (page = 0; page < this.PAGE_COUNT; page += 2)
        this.spine.appendChild(this.pages[page].element);

    for (--page; page >= 0; page -= 2)
        this.spine.appendChild(this.pages[page].element);
};

/**
 * Hide the book
 */
CardBook.prototype.hide = function() {
    this.element.classList.add(this.CLASS_HIDDEN);
};

/**
 * Show the book
 */
CardBook.prototype.show = function() {
    this.element.classList.remove(this.CLASS_HIDDEN);
};

/**
 * Reverse any flips in progress
 */
CardBook.prototype.reverse = function() {
    for (const flip of this.flips)
        flip.reverse();

    this.flips = this.flips.reverse();
    this.page -= this.flips.length * this.flipDirection * 2;

    this.flipDirection = -this.flipDirection;
};

/**
 * Flip to the right
 */
CardBook.prototype.flipRight = function() {
    if (this.flips.length !== 0 && this.flipDirection === -1) {
        this.reverse();

        return;
    }

    if (this.page === this.flips.length * 2)
        return;

    this.pages[this.page - (this.flips.length + 1) * 2].show(this.cards);

    this.flips.push(new CardBook.Flip());
    this.flipDirection = 1;
};

/**
 * Flip to the left
 */
CardBook.prototype.flipLeft = function() {
    if (this.flips.length !== 0 && this.flipDirection === 1) {
        this.reverse();

        return;
    }

    if (this.page + 2 === this.PAGE_COUNT - this.flips.length * 2)
        return;

    this.pages[this.page + this.flips.length * 2 + 3].show(this.cards);

    this.flips.push(new CardBook.Flip());
    this.flipDirection = -1;
};

/**
 * Update the card book
 */
CardBook.prototype.update = function() {
    for (let flip = this.flips.length; flip-- > 0;) if (this.flips[flip].update()) {
        this.flips.splice(flip, 1);

        if (this.flipDirection === 1) {
            this.pages[this.page + 2 * flip + 1].hide();
            this.pages[this.page + 2 * flip - 1].setNoFlip();
        }
        else {
            this.pages[this.page].hide();
            this.pages[this.page + 2].setNoFlip();
        }

        this.page -= this.flipDirection * 2;
    }
};

/**
 * Render the page flips
 * @param {Number} time The amount of time since the last update
 */
CardBook.prototype.renderFlips = function(time) {
    let index = this.flipDirection === -1 ? this.page + 1 : this.page;

    for (const flip of this.flips) {
        const flipAmount = flip.flipPrevious + (flip.flip - flip.flipPrevious) * time;

        if (!flip.halfway && flipAmount < 0) {
            this.pages[index].hide();
            this.pages[index - this.flipDirection].show(this.cards);

            flip.halfway = true;
        }

        this.pages[index].setFlip(flipAmount);
        this.pages[index - this.flipDirection].setFlip(-flipAmount);

        index -= 2 * this.flipDirection;
    }
};

/**
 * Render the card book
 * @param {Number} time The amount of time since the last update
 */
CardBook.prototype.render = function(time) {
    if (this.flips.length !== 0)
        this.renderFlips(time);
};

/**
 * Create a page turn button
 * @param {String} classSide The class name for the buttons side
 * @param {Function} onClick The function to execute when the button has been clicked
 * @returns {HTMLButtonElement} The page button element
 */
CardBook.prototype.createButtonPage = function(classSide, onClick) {
    const element = document.createElement("button");

    element.className = this.CLASS_BUTTON;
    element.classList.add(classSide);
    element.onclick = onClick;

    return element;
};

/**
 * Find a point to snap to
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
CardBook.prototype.findSnap = function(x, y) {
    if (this.flips.length === 0)
        return this.pages[this.page].findSnap(x, y) || this.pages[this.page + 1].findSnap(x, y);

    return null;
};

/**
 * Add a card to the book
 * @param {Card} card The card
 * @param {Vector2} snap A valid snap position obtained from one of the pages
 */
CardBook.prototype.addToBook = function(card, snap) {
    this.pages[this.page].addCard(card, snap) || this.pages[this.page + 1].addCard(card, snap);
};

/**
 * Remove a card from the book
 * @param {Card} card A card
 */
CardBook.prototype.removeFromBook = function(card) {
    this.pages[this.page].removeCard(card) || this.pages[this.page + 1].removeCard(card);
};

/**
 * Fit the book and its contents to the view size
 */
CardBook.prototype.fit = function() {
    const pageHeight = Math.round(this.height * this.HEIGHT * (1 - 2 * this.PADDING_PAGE));
    const cardPadding = Math.round(pageHeight * this.PADDING_CARD);
    const cardHeight = Math.round((pageHeight - 3 * cardPadding) * .5);
    const cardWidth = Math.round(cardHeight * Card.prototype.RATIO);
    const pageWidth = cardWidth * 2 + cardPadding * 3;
    const bookWidth = pageWidth * 2 + Math.round(this.height * this.HEIGHT * this.PADDING_PAGE * 2);

    this.element.style.width = bookWidth + "px";
    this.element.style.height = this.height * this.HEIGHT + "px";
    this.element.style.left = (this.width - bookWidth) * .5 + "px";
    this.element.style.top = this.height * this.PADDING_TOP + "px";
    this.spine.style.height = pageHeight + "px";

    for (const page of this.pages)
        page.fit(cardWidth, cardHeight, cardPadding);
};

/**
 * Create the initial set of pages
 * @param {Number} first The index of the first open page on the left side of the book
 * @returns {CardPage[]} The initial pages
 */
CardBook.prototype.createPages = function(first) {
    const pages = new Array(this.PAGE_COUNT);

    for (let page = 0; page < this.PAGE_COUNT; ++page) {
        pages[page] = new CardPage(((page & 1) << 1) - 1);

        if (page === first || page === first + 1)
            pages[page].show();
    }

    return pages;
};

/**
 * Create the book spine element
 * @returns {HTMLDivElement} The spine element
 */
CardBook.prototype.createSpine = function() {
    const element = document.createElement("div");

    element.id = this.ID_SPINE;

    return element;
};

/**
 * Create the root element for the card book GUI
 * @param {HTMLDivElement} spine The book spine element
 * @returns {HTMLDivElement} The element
 */
CardBook.prototype.createElement = function(spine) {
    const element = document.createElement("div");

    element.id = this.ID;
    element.className = this.CLASS_HIDDEN;

    element.appendChild(spine);

    return element;
};

/**
 * Resize the card book GUI
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 */
CardBook.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.fit();
};