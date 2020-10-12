/**
 * A book with card pages
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @constructor
 */
const CardBook = function(width, height) {
    this.spine = this.createSpine();
    this.element = this.createElement(this.spine);
    this.width = width;
    this.height = height;
    this.pages = this.createPages();
    this.page = 0;

    this.spine.appendChild(this.pages[0].element);
    this.spine.appendChild(this.pages[1].element);

    this.fit();
};

CardBook.prototype.ID = "book";
CardBook.prototype.ID_SPINE = "spine";
CardBook.prototype.CLASS_HIDDEN = "hidden";
CardBook.prototype.PAGE_COUNT = 8;
CardBook.prototype.PADDING_TOP = .07;
CardBook.prototype.PADDING_PAGE = .07;
CardBook.prototype.PADDING_CARD = .05;
CardBook.prototype.HEIGHT = .65;

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
 * Find a point to snap to
 * @param {Vector2} position The position
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
CardBook.prototype.findSnap = function(position) {
    return this.pages[this.page].findSnap(position) || this.pages[this.page + 1].findSnap(position);
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
 * @returns {CardPage[]} The initial pages
 */
CardBook.prototype.createPages = function() {
    const pages = new Array(this.PAGE_COUNT);

    for (let page = 0; page < this.PAGE_COUNT; ++page)
        pages[page] = new CardPage(((page & 1) << 1) - 1);

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