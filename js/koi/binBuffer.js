/**
 * A binary buffer
 * @param {Number[]} bytes An array of byte values
 * @constructor
 */
const BinBuffer = function(bytes = []) {
    this.bytes = bytes;
    this.at = 0;
};

/**
 * Read the next byte from this buffer
 * @returns {Number} The next byte in this buffer
 */
BinBuffer.prototype.readByte = function() {
    return this.bytes[this.at++];
};

/**
 * Write a 32 bit integer to this binary buffer
 * @param {Number} integer A number that fits inside a 32 bit integer
 */
BinBuffer.prototype.writeInt32 = function(integer) {
    this.bytes.push(integer & 0xFF);
    this.bytes.push((integer >> 8) & 0xFF);
    this.bytes.push((integer >> 16) & 0xFF);
    this.bytes.push((integer >> 24) & 0xFF);
};

/**
 * Write an unsigned 32 bit integer to this binary buffer
 * @param {Number} integer A number that fits inside an unsigned 32 bit integer
 */
BinBuffer.prototype.writeUint32 = function(integer) {
    this.writeInt32(integer);
};

/**
 * Write a floating point number to this binary buffer
 * @param {Number} float A floating point number
 */
BinBuffer.prototype.writeFloat = function(float) {
    const buffer = new ArrayBuffer(4);
    const floatBuffer = new Float32Array(buffer);

    floatBuffer[0] = float;

    this.writeInt32(new Int32Array(buffer)[0]);
};

/**
 * Read a 32 bit integer from this binary buffer
 * @returns {Number} A 32 bit integer
 */
BinBuffer.prototype.readInt32 = function() {
    return this.readByte() | (this.readByte() << 8) | (this.readByte() << 16) | (this.readByte() << 24);
};

/**
 * Read an unsigned 32 bit integer from this binary buffer
 * @returns {Number} An unsigned 32 bit integer
 */
BinBuffer.prototype.readUint32 = function() {
    let signed = this.readInt32();

    if (signed < 0)
        return 0x80000000 + (signed & 0x7FFFFFFF);

    return signed;
};

/**
 * Read a floating point number from this binary buffer
 * @returns {Number} A floating point number
 */
BinBuffer.prototype.readFloat = function() {
    const buffer = new ArrayBuffer(4);
    const intBuffer = new Int32Array(buffer);

    intBuffer[0] = this.readInt32();

    return new Float32Array(buffer)[0];
};