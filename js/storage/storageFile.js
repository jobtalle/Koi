/**
 * A storage system using files
 * @constructor
 */
const StorageFile = function() {
    StorageSystem.call(this);
};

StorageFile.prototype = Object.create(StorageSystem.prototype);
StorageFile.prototype.EXTENSION = ".sav";
StorageFile.prototype.DIRECTORY = "save/";

if (window["require"]) {
    const electron = window["require"]("electron");
    const url = window["require"]("url");
    const fs = window["require"]("fs");
    const os = window["require"]("os");
    let directory = StorageFile.prototype.DIRECTORY;

    if (os["platform"]() === "darwin")
        directory = os["homedir"]() + "/Library/Application Support/koifarm/" + directory;

    const makeDirectory = () => {
        if (!fs["existsSync"](directory))
            fs["mkdirSync"](directory);
    };

    const fileExists = name => {
        return fs["existsSync"](name);
    };

    const pngFilter = {
        "name": "PNG Image",
        "extensions": ["png"]
    };

    StorageFile.prototype.set = async function (key, value) {
        makeDirectory();

        fs["writeFileSync"](url["pathToFileURL"](directory + key + this.EXTENSION), value);
    };

    StorageFile.prototype.setBuffer = async function(key, value) {
        makeDirectory();

        fs["writeFileSync"](url["pathToFileURL"](directory + key + this.EXTENSION), value.toByteArray());
    };

    StorageFile.prototype.get = async function(key) {
        const file = directory + key + this.EXTENSION;
        let contents = null;

        try {
            if (fileExists(file))
                contents = fs["readFileSync"](file, "utf8");
        }
        catch (error) {

        }

        return contents;
    };

    StorageFile.prototype.getBuffer = async function(key) {
        const file = directory + key + this.EXTENSION;
        let contents = null;

        try {
            if (fileExists(file))
                contents = fs["readFileSync"](file);
        }
        catch (error) {

        }

        return contents ? new BinBuffer(contents) : null;
    };

    StorageFile.prototype.remove = async function(key) {
        const file = directory + key + this.EXTENSION;

        if (fileExists(file))
            fs["unlinkSync"](url["pathToFileURL"](file));
    };

    StorageFile.prototype.imageToFile = function(blob, name) {
        electron["remote"]["dialog"]["showSaveDialog"](
            null,
            {
                filters: [pngFilter]
            }).then(result => {
            if (!result["canceled"]) {
                const reader = new FileReader();

                reader.addEventListener("loadend", () => {
                    fs["writeFileSync"](url["pathToFileURL"](result["filePath"]), new Uint8Array(reader.result));
                });

                reader.readAsArrayBuffer(blob);
            }
        });
    };
}