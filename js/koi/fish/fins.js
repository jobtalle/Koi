/**
 * The fins
 * @param {Fin[]} fins All fins for this fins
 * @constructor
 */
const Fins = function(fins) {
    this.fins = fins;
};

Fins.prototype.FIN_PAIRS_MIN = 1;
Fins.prototype.FIN_PAIRS_MAX = 3;

/**
 * Deserialize the fins
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {Fins} The fins
 */
Fins.deserialize = function(buffer) {
    const fins = new Array(buffer.readUint8());

    if (!(fins.length >= Fins.prototype.FIN_PAIRS_MIN && fins.length <= Fins.prototype.FIN_PAIRS_MAX))
        throw new RangeError();

    for (let fin = 0; fin < fins.length; ++fin)
        fins[fin] = Fin.deserialize(buffer);

    return new Fins(fins);
};

/**
 * Serialize the fins
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Fins.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.fins.length);

    for (let fin = 0, finCount = this.fins.length; fin < finCount; ++fin)
        this.fins[fin].serialize(buffer);
};

/**
 * Make all fins by mirroring the initial fins
 * @returns {Fin[]} fins All fins
 */
Fins.prototype.makeAll = function() {
    const fins = this.fins.slice();

    for (let fin = 0, finCount = this.fins.length; fin < finCount; ++fin)
        fins.push(this.fins[fin].copyMirrored());

    return fins;
};