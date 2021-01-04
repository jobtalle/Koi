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
 * @param {String} value The value of the item
 */
StorageLocal.prototype.set = function(key, value) {
    window["localStorage"].setItem(key, value);
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
 * Remove an item
 * @param {String} key The key of the item
 */
StorageLocal.prototype.remove = function(key) {
    window["localStorage"].removeItem(key);
};