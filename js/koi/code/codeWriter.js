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
 */
CodeWriter.prototype.write = function() {
    const canvas = document.createElement("canvas");

    canvas.width = canvas.height = this.RADIUS << 1;

    console.log(canvas);
};