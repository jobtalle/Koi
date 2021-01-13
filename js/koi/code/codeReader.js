/**
 * A code reader
 * @param {HTMLImageElement} image An image to read as code
 * @constructor
 */
const CodeReader = function(image) {
    this.image = image;
};

CodeReader.prototype = Object.create(Code.prototype);

/**
 * Read
 * @returns {FishBody}
 */
CodeReader.prototype.read = function() {

};