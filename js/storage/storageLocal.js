/**
 * A storage system using the browsers local storage
 * @constructor
 */
const StorageLocal = function() {

};

StorageLocal.prototype = Object.create(Storage.prototype);

/**
 * Set the value of an item
 * @param {String} key The key of the item
 * @param {Object} value The value of the item
 */
StorageLocal.prototype.set = function(key, value) {
    window["localStorage"][key] = value;
};

/**
 * Get an item
 * @param {String} key The key of the item
 * @returns {Object} The value of the item
 */
StorageLocal.prototype.get = function(key) {
    return window["localStorage"][key];
};

/**
 * Remove an item
 * @param {String} key The key of the item
 */
StorageLocal.prototype.remove = function(key) {
    window["localStorage"].removeItem(key);
};