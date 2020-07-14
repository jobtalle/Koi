/**
 * A LZW compression & decompression utility
 * @param {Number[]} source A source byte array to either compress or decompress
 * @constructor
 */
const Compress = function(source) {
    this.source = source;
};

/**
 * Convert an array of indices to an array of bytes
 * @param {Number[]} indices An array of indices
 * @param {Number} maxIndex The highest number in the given index array
 * @returns {Number[]} A byte array
 */
Compress.prototype.indicesToBytes = function(indices, maxIndex) {
    const bytes = [];
    let byteIndex = 0;
    let stride = 8;
    let offset = 0;

    while (1 << stride < maxIndex + 1)
        ++stride;

    bytes.push(stride - 8);

    for (const index of indices) {
        let bits = stride;

        while (bits > 0) {
            const store = Math.min(bits, 8 - offset);
            const data = (index >> bits - store & (1 << store) - 1) << 8 - offset - store;

            if (offset === 0) {
                bytes.push(data);
                ++byteIndex;
            }
            else
                bytes[byteIndex] |= data;

            offset = (offset + store) & 7;
            bits -= store;
        }
    }

    return bytes;
};

/**
 * Convert an array of bytes to an array of indices
 * @param {Number[]} bytes An array of bytes
 * @returns {Number[]} An index array
 */
Compress.prototype.bytesToIndices = function(bytes) {
    const stride = bytes[0] + 8;
    const indices = [0];
    let index = 0;
    let bits = stride;

    for (let byte = 1, byteCount = bytes.length; byte < byteCount; ++byte) {
        let offset = 0;

        while (offset < 8) {
            const fraction = Math.min(8 - offset, bits);

            indices[index] |= ((bytes[byte] >> 8 - fraction - offset) & (1 << fraction) - 1) << bits - fraction;

            bits -= fraction;
            offset += fraction;

            if (bits === 0) {
                if ((byteCount - byte << 3) - offset < stride)
                    break;

                indices.push(0);
                bits = stride;
                ++index;
            }
        }
    }

    return indices;
};

/**
 * Compress the data
 * @returns {Number[]} The compressed byte array
 */
Compress.prototype.compress = function() {
    const dict = {};
    const indices = [];
    let maxIndex = -1;

    for (let i = 0; i <= 0xFF; ++i)
        dict[String.fromCharCode(i)] = i;

    let word = "";
    let dictSize = 256;

    for (let i = 0, length = this.source.length; i < length; ++i) {
        let curChar = String.fromCharCode(this.source[i]);
        let joinedWord = word + curChar;

        if (dict.hasOwnProperty(joinedWord))
            word = joinedWord;
        else {
            const dictIndex = dict[word];

            if (dictIndex > maxIndex)
                maxIndex = dictIndex;

            indices.push(dictIndex);
            dict[joinedWord] = dictSize++;
            word = curChar;
        }
    }

    if (word !== "")
        indices.push(dict[word]);

    return this.indicesToBytes(indices, maxIndex);
};

/**
 * Decompress the data
 * @returns {Number[]} The decompressed byte array
 */
Compress.prototype.decompress = function() {
    const indices = this.bytesToIndices(this.source);
    const dict = {};
    const bytes = [indices[0]];

    for (let i = 0; i <= 0xFF; ++i)
        dict[i] = String.fromCharCode(i);

    let word = String.fromCharCode(indices[0]);
    let result = word;
    let entry = "";
    let dictSize = 256;

    for (let i = 1, length = indices.length; i < length; ++i) {
        let curIndex = indices[i];

        if (dict[curIndex] !== undefined)
            entry = dict[curIndex];
        else
            entry = word + word[0];

        result += entry;

        for (let entryIndex = 0, entryLength = entry.length; entryIndex < entryLength; ++entryIndex)
            bytes.push(entry.charCodeAt(entryIndex));

        dict[dictSize++] = word + entry[0];

        word = entry;
    }

    return bytes;
};