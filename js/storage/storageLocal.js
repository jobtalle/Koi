/**
 * A storage system using the browsers local storage
 * @constructor
 */
const StorageLocal = function() {
    StorageSystem.call(this);
};

StorageLocal.prototype = Object.create(StorageSystem.prototype);

/**
 * Set the value of an item
 * @param {String} key The key of the item
 * @param {String} value The value of the item
 */
StorageLocal.prototype.set = function(key, value) {
    window["localStorage"].setItem(key, value);
};

/**
 * Set the buffer of an item
 * @param {String} key The key of the item
 * @param {BinBuffer} value The buffer of the item
 */
StorageLocal.prototype.setBuffer = function(key, value) {
    this.set(key, value.toString());
};

/**
 * Get an item
 * @param {String} key The key of the item
 * @returns {String|null} The value of the item, or null if it does not exist
 */
StorageLocal.prototype.get = function(key) {
    return window["localStorage"].getItem(key);
};

/**
 * Get a buffer
 * @param {String} key The key of the buffer
 * @returns {BinBuffer|null} The buffer, or null if it does not exist
 */
StorageLocal.prototype.getBuffer = function(key) {
    const string = this.get(key);

    if (string)
        return new BinBuffer(string);

    return null;
};

/**
 * Remove an item
 * @param {String} key The key of the item
 */
StorageLocal.prototype.remove = function(key) {
    window["localStorage"].removeItem(key);
};