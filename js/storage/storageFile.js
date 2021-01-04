/**
 * A storage system using files
 * @constructor
 */
const StorageFile = function() {

};

StorageFile.prototype = Object.create(StorageSystem.prototype);
StorageFile.prototype.EXTENSION = ".sav";

if (window["require"]) {
    const url = window["require"]("url");
    const fs = window["require"]("fs");

    StorageFile.prototype.set = function (key, value) {
        fs["writeFileSync"](url["pathToFileURL"](key + this.EXTENSION), value);
    };

    StorageFile.prototype.get = function(key) {
        let contents = null;

        try {
            contents = fs["readFileSync"](key + this.EXTENSION);
        }
        catch(error) {

        }

        return contents;
    };

    StorageFile.prototype.remove = function(key) {
        fs["unlinkSync"](url["pathToFileURL"](key + this.EXTENSION));
    };
}