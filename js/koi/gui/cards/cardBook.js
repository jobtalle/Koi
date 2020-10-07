/**
 * A book with card pages
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @constructor
 */
const CardBook = function(width, height) {
    this.spine = this.createSpine(500);
    this.element = this.createElement(this.spine);
    this.width = width;
    this.height = height;
    this.pages = this.createPages();
    this.page = 0;

    this.spine.appendChild(this.pages[0].element);
    this.spine.appendChild(this.pages[1].element)
};

CardBook.prototype.ID = "book";
CardBook.prototype.ID_SPINE = "spine";
CardBook.prototype.PAGE_COUNT = 8;

/**
 * Deserialize the card book
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @throws {RangeError} A range error if deserialized values are not valid
 */
CardBook.prototype.deserialize = function(buffer) {
    // TODO
};

/**
 * Serialize the card book
 * @param {BinBuffer} buffer The buffer to serialize to
 */
CardBook.prototype.serialize = function(buffer) {
    // TODO
};

/**
 * Create the initial set of pages
 * @returns {CardPage[]} The initial pages
 */
CardBook.prototype.createPages = function() {
    const pages = new Array(this.PAGE_COUNT);

    for (let page = 0; page < this.PAGE_COUNT; ++page)
        pages[page] = new CardPage(300, 500, ((page & 1) << 1) - 1);

    return pages;
};

/**
 * Create the book spine element
 * @param {Number} pageHeight The height of a page
 * @returns {HTMLDivElement} The spine element
 */
CardBook.prototype.createSpine = function(pageHeight) {
    const element = document.createElement("div");

    element.id = this.ID_SPINE;
    element.style.height = pageHeight + "px";

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
};