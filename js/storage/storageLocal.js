/**
 * A storage system using the browsers local storage
 * @constructor
 */
const StorageLocal = function() {
    StorageSystem.call(this);
};

StorageLocal.prototype = Object.create(StorageSystem.prototype);

StorageLocal.prototype.setItem = async function(key, value) {
  return new Promise((resolve, reject) => {
        resolve(window.localStorage.setItem(key, value));
      }
    );
};

StorageLocal.prototype.getItem = async function(key) {
    return new Promise((resolve, reject) => {
        if (window.localStorage.getItem(key) === null)
            resolve(null);
        else
            resolve(window.localStorage.getItem(key));
    });
};

StorageLocal.prototype.removeItem = async function(key){
    return new Promise((resolve, reject) => {
            resolve(window.localStorage.removeItem(key));
        }
    );
};

/**
 * Set the value of an item
 * @param {String} key The key of the item
 * @param {String} value The value of the item
 */
StorageLocal.prototype.set = function(key, value) {
    return this.setItem(key, value);
};

/**
 * Set the buffer of an item
 * @param {String} key The key of the item
 * @param {BinBuffer} value The buffer of the item
 */
StorageLocal.prototype.setBuffer = function(key, value) {
    return this.set(key, value.toString());
};

/**
 * Get an item
 * @param {String} key The key of the item
 * @returns {String|null} The value of the item, or null if it does not exist
 */
StorageLocal.prototype.get = function(key) {
    const item = this.getItem(key);
    return item;
};

/**
 * Get a buffer
 * @param {String} key The key of the buffer
 * @returns {BinBuffer|null} The buffer, or null if it does not exist
 */
StorageLocal.prototype.getBuffer = async function(key) {
    const string = await this.get(key);

    if (string)
        return new BinBuffer(string);

    return null;
};

/**
 * Remove an item
 * @param {String} key The key of the item
 */
StorageLocal.prototype.remove = function(key) {
    this.removeItem(key);
};

/**
 * Save an image
 * @param {Blob} blob The image blob data
 * @param {String} name The file name
 */
StorageLocal.prototype.imageToFile = function(blob, name) {
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = name;

    document.body.appendChild(a);

    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
};