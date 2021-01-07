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

    const fileExists = name => {
        return fs["existsSync"](name);
    };

    StorageFile.prototype.set = function (key, value) {
        fs["writeFileSync"](url["pathToFileURL"](key + this.EXTENSION), value);
    };

    StorageFile.prototype.setBuffer = function(key, value) {
        fs["writeFileSync"](url["pathToFileURL"](key + this.EXTENSION), value.toByteArray());
    };

    StorageFile.prototype.get = function(key) {
        let contents = null;

        try {
            if (fileExists(key + this.EXTENSION))
                contents = fs["readFileSync"](key + this.EXTENSION, "utf8");
        }
        catch (error) {

        }

        return contents;
    };

    StorageFile.prototype.getBuffer = function(key) {
        let contents = null;

        try {
            if (fileExists(key + this.EXTENSION))
                contents = fs["readFileSync"](key + this.EXTENSION);
        }
        catch (error) {

        }

        return contents ? new BinBuffer(contents) : null;
    };

    StorageFile.prototype.remove = function(key) {
        if (fileExists(key + this.EXTENSION))
            fs["unlinkSync"](url["pathToFileURL"](key + this.EXTENSION));
    };
}