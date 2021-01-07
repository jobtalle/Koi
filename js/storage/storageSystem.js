/**
 * A data storage system for save files
 * @constructor
 */
const StorageSystem = function() {

};

/**
 * Set the value of an item
 * @param {String} key The key of the item
 * @param {String} value The value of the item
 */
StorageSystem.prototype.set = function(key, value) {

};

/**
 * Set the buffer of an item
 * @param {String} key The key of the item
 * @param {BinBuffer} value The buffer of the item
 */
StorageSystem.prototype.setBuffer = function(key, value) {

};

/**
 * Get an item
 * @param {String} key The key of the item
 * @returns {String|null} The value of the item, or null if it does not exist
 */
StorageSystem.prototype.get = function(key) {

};

/**
 * Get a buffer
 * @param {String} key The key of the buffer
 * @returns {BinBuffer|null} The buffer, or null if it does not exist
 */
StorageSystem.prototype.getBuffer = function(key) {

};

/**
 * Remove an item
 * @param {String} key The key of the item
 */
StorageSystem.prototype.remove = function(key) {

};