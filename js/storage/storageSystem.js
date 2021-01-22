/**
 * A data storage system for save files
 * @constructor
 */
const StorageSystem = function() {
    this.hasClipboard = navigator.clipboard["write"] && window["ClipboardItem"];
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

/**
 * Copy an image to the clipboard
 * @param {Blob} blob The image blob data
 */
StorageSystem.prototype.imageToClipboard = function(blob) {
    if (!this.hasClipboard)
        return;

    navigator.clipboard["write"]([
        new window["ClipboardItem"]({
            [blob.type]: blob
        })
    ]);
};

/**
 * Save an image
 * @param {Blob} blob The image blob data
 * @param {String} name The file name
 */
StorageSystem.prototype.imageToFile = function(blob, name) {

};