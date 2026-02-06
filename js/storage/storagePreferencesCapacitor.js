/**
 * A storage system using the browsers local storage
 * @constructor
 */
const StoragePreferencesCapacitor = function() {
    StorageSystem.call(this);

    if (!Capacitor.isPluginAvailable('Preferences')) {
       throw new Error('Capacitor Preferences API is not available');
    }
};

StoragePreferencesCapacitor.prototype = Object.create(StorageSystem.prototype);

StoragePreferencesCapacitor.prototype.setItem = async function(key, value) {
  return await Capacitor.Plugins.Preferences.set({
    key: key,
    value: JSON.stringify(value),
  });
};

StoragePreferencesCapacitor.prototype.getItem = async function(key) {
  const item = await Capacitor.Plugins.Preferences.get({ key: key });
  return JSON.parse(item.value);
};

StoragePreferencesCapacitor.prototype.removeItem = async function(key){
  return await Capacitor.Plugins.Preferences.remove({
    key: key,
  });
};

/**
 * Set the value of an item
 * @param {String} key The key of the item
 * @param {String} value The value of the item
 */
StoragePreferencesCapacitor.prototype.set = function(key, value) {
    return this.setItem(key, value);
};

/**
 * Set the buffer of an item
 * @param {String} key The key of the item
 * @param {BinBuffer} value The buffer of the item
 */
StoragePreferencesCapacitor.prototype.setBuffer = function(key, value) {
    return this.set(key, value.toString());
};

/**
 * Get an item
 * @param {String} key The key of the item
 * @returns {String|null} The value of the item, or null if it does not exist
 */
StoragePreferencesCapacitor.prototype.get = function(key) {
    const item = this.getItem(key);
    return item;
};

/**
 * Get a buffer
 * @param {String} key The key of the buffer
 * @returns {BinBuffer|null} The buffer, or null if it does not exist
 */
StoragePreferencesCapacitor.prototype.getBuffer = async function(key) {
    const string = await this.get(key);

    if (string)
        return new BinBuffer(string);

    return null;
};

/**
 * Remove an item
 * @param {String} key The key of the item
 */
StoragePreferencesCapacitor.prototype.remove = function(key) {
    this.removeItem(key);
};

/**
 * Save an image
 * @param {Blob} blob The image blob data
 * @param {String} name The file name
 */
StoragePreferencesCapacitor.prototype.imageToFile = function(blob, name) {
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