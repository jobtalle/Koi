/**
 * The fins
 * @param {Fin} front The front fin
 * @param {Fin} back The back fin
 * @constructor
 */
const Fins = function(front, back) {
    this.front = front;
    this.back = back;
};

/**
 * Deserialize the fins
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {Fins} The fins
 */
Fins.deserialize = function(buffer) {
    return new Fins(Fin.deserialize(buffer), Fin.deserialize(buffer));
};

/**
 * Serialize the fins
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Fins.prototype.serialize = function(buffer) {
    this.front.serialize(buffer);
    this.back.serialize(buffer);
};

/**
 * Make all fins by mirroring the initial fins
 * @returns {Fin[]} fins All fins
 */
Fins.prototype.makeAll = function() {
    return [
        this.front,
        this.front.copyMirrored(),
        this.back,
        this.back.copyMirrored()
    ];
};