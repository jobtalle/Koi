/**
 * A storage system using files
 * @constructor
 */
const StorageFileCapacitor = function() {
    StorageSystem.call(this);

    this.hasClipboard = false;

    if (!Capacitor.isPluginAvailable('Filesystem')) {
       throw new Error('Capacitor Preferences API is not available');
    }

};

StorageFileCapacitor.prototype = Object.create(StorageSystem.prototype);
StorageFileCapacitor.prototype.EXTENSION = ".sav";
StorageFileCapacitor.prototype.DIRECTORY_SAVE = "save/";
StorageFileCapacitor.prototype.DIRECTORY_IMAGE = "koi/";

const directoryLibrary = "LIBRARY";
const directoryData = "DOCUMENTS";
const encodingText = "utf8";

const writeFileCap = async (filename, content, dir, encoding=null) => {
  await Capacitor.Plugins.Filesystem.writeFile({
    path: filename,
    data: content,
    directory: dir,
    encoding: encoding,
  });
};

const readFileCap = async (filename, dir, encoding=null) => {
  const contents = await Capacitor.Plugins.Filesystem.readFile({
    path: filename,
    directory: dir,
    encoding: encoding,
  });

  return contents.data;
};

const deleteFileCap = async (filename, dir = directoryLibrary) => {
  await Capacitor.Plugins.Filesystem.deleteFile({
    path: filename,
    directory: dir,
  });
};

const fileExistsCap = async (filename, dir = directoryLibrary) => {
    try {
        await Capacitor.Plugins.Filesystem.stat(
            {
                path: filename,
                directory: dir,
            }
        );
        return true;
    } catch (checkDirException) {
        if (checkDirException.message === 'File does not exist') {
            return false;
    } else {
        return false;
    }
  }
};

const makeDirectory = async (path, dir = directory) => {
    if (await fileExistsCap(path, dir))
        return;

    try {
        await Capacitor.Plugins.Filesystem.mkdir({
            path: path,
            directory: dir,
            recursive: true
        });
    } catch (error) {
        if (error.message.toLowerCase() !== "directory exists")
            throw error;
    }

};

const fileExists = name => {
    return fileExistsCap(name);
};

const pngFilter = {
    "name": "PNG Image",
    "extensions": ["png"]
};

StorageFileCapacitor.prototype.set = async function (key, value) {
    return writeFileCap(key + this.EXTENSION, value, directoryLibrary, encodingText);
};

StorageFileCapacitor.prototype.setBuffer = async function(key, value) {
    // makeDirectory();

    return writeFileCap(key + this.EXTENSION, value.toString(), directoryLibrary, encodingText);
};

StorageFileCapacitor.prototype.get = async function(key) {
    const file = key + this.EXTENSION;
    let contents = null;

    try {
        if (await fileExists(file))
            contents = readFileCap(file, directoryLibrary, encodingText);
    }
    catch (error) {

    }

    return contents;
};

StorageFileCapacitor.prototype.getBuffer = async function(key) {
    const file = key + this.EXTENSION;
    let contents = null;

    try {
        if (await fileExists(file))
            contents = await readFileCap(file, directoryLibrary, encodingText);
    }
    catch (error) {

    }

    return contents ? new BinBuffer(contents) : null;
};

StorageFileCapacitor.prototype.remove = async function(key) {
    const file = key + this.EXTENSION;

    if (await fileExists(file))
        await deleteFileCap(file);
};

const pickFile = async () => {
  const result = await Capacitor.Plugins.FilePicker.pickImages({
    "limit": 0,
    "readData": true
  });
  return result.files;
};

const pickFiles = async () => {
    const result = await Capacitor.Plugins.FilePicker.pickFiles({
    "limit": 0,
    "extensions": ["png", "jpg", "jpeg"],
    "readData": true
  });
  return result.files;
}

StorageFileCapacitor.prototype.loadImage = async function(name) {
    const files = await pickFile();

    const e = new CustomEvent('loadImage');

    e.dataTransfer = {
        files: files
    }

    window.dispatchEvent(e);
}

StorageFileCapacitor.prototype.imageToFile = async function(blob, name) {

    makeDirectory(this.DIRECTORY_IMAGE, directoryData).then( () => {
            const file = this.DIRECTORY_IMAGE + name;

            const reader = new FileReader();

            reader.onloadend = function() {
                const base64Data = reader.result;

                writeFileCap(file, base64Data, directoryData).then( () => {
                    if (Capacitor.isPluginAvailable('Toast'))
                        Capacitor.Plugins.Toast.show({
                            text: 'File written',
                            duration: 'long'
                        });
                });
            }

            reader.readAsDataURL(blob);

        }
    );


};
