/**
 * A code writer
 * @param {FishBody} body A fish body to encode
 * @constructor
 */
const CodeWriter = function(body) {

};

CodeWriter.prototype = Object.create(Code.prototype);

/**
 * Write
 * @returns {HTMLCanvasElement} A canvas containing the code
 */
CodeWriter.prototype.write = function() {
    const canvas = document.createElement("canvas");

    canvas.width = canvas.height = this.RADIUS << 1;

    return canvas;
};