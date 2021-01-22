/**
 * A binary buffer
 * @param {String|Uint8Array} [data] A string or a byte array to deserialize from
 * @constructor
 */
const BinBuffer = function(data = null) {
    this.bytes = this.constructFrom(data);
    this.at = 0;
};

/**
 * Construct the bytes from a source
 * @param {String|Uint8Array|null} data The data to construct the bytes from
 * @returns {Number[]} The bytes
 */
BinBuffer.prototype.constructFrom = function(data) {
    if (data === null)
        return [];
    if (typeof(data) === "string")
        return this.fromString(data);

    return this.fromByteArray(data);
};

/**
 * Convert the contents of this buffer to a string
 * @returns {String} The string
 */
BinBuffer.prototype.toString = function() {
    return btoa(String.fromCharCode(...this.bytes));
};

/**
 * Convert the contents of this buffer to a byte array
 * @returns {Uint8Array} The byte array
 */
BinBuffer.prototype.toByteArray = function() {
    return new Uint8Array(this.bytes);
};

/**
 * Get the contents of this buffer from a string
 * @param {String} string A base64 string
 * @returns {Number[]} The bytes stored in this string
 */
BinBuffer.prototype.fromString = function(string) {
    return atob(string).split("").map(c => c.charCodeAt(0));
};

/**
 * Get the contents of this buffer from a byte array
 * @param {Uint8Array} array The byte array
 * @returns {Number[]} The bytes stored in this string
 */
BinBuffer.prototype.fromByteArray = function(array) {
    return Array.from(array);
};

/**
 * Check whether this buffer is equal to another buffer
 * @param {BinBuffer} other The other buffer
 * @returns {Boolean} True if the buffers have the same contents
 */
BinBuffer.prototype.equalTo = function(other) {
    if (this.bytes.length !== other.bytes.length)
        return false;

    for (let byte = 0, byteCount = this.bytes.length; byte < byteCount; ++byte)
        if (this.bytes[byte] !== other.bytes[byte])
            return false;

    return true;
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
 * Write an unsigned 16 bit integer to this binary buffer
 * @param {Number} integer A number that fits inside an unsigned 16 bit integer
 */
BinBuffer.prototype.writeUint16 = function(integer) {
    this.bytes.push(integer & 0xFF);
    this.bytes.push((integer >> 8) & 0xFF);
};

/**
 * Write an unsigned 8 bit integer to this binary buffer
 * @param {Number} integer A number that fits inside an unsigned 8 bit integer
 */
BinBuffer.prototype.writeUint8 = function(integer) {
    this.bytes.push(integer & 0xFF);
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
 * Read an unsigned 16 bit integer from this binary buffer
 * @returns {Number} An unsigned 16 bit integer
 */
BinBuffer.prototype.readUint16 = function() {
    return this.readByte() | (this.readByte() << 8);
};

/**
 * Read an unsigned 8 bit integer from this binary buffer
 * @returns {Number} An unsigned 8 bit integer
 */
BinBuffer.prototype.readUint8 = function() {
    return this.readByte();
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