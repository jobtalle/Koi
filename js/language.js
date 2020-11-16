/**
 * The language loader
 * @param {String} file A path to a JSON file containing the text
 * @constructor
 */
const Language = function(file) {
    this.file = file;
    this.data = {};
};

Language.prototype.KEY_INCLUDE = "INCLUDE";

/**
 * Add language data to the language object
 * @param {Object} data An object containing language data
 */
Language.prototype.add = function(data) {
    Object.assign(this.data, data);
};

/**
 * Load language data
 * @param {Function} onFinish A function to call when loading has finished
 * @param {Function} onFailure A function to call when loading has failed
 * @param {String} [file] A file to load
 */
Language.prototype.load = function(onFinish, onFailure, file = this.file) {
    const request = new XMLHttpRequest();

    request.overrideMimeType("text/plain");
    request.open("GET", file, true);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const data = JSON.parse(request.responseText);

                this.add(data);

                if (data.hasOwnProperty(this.KEY_INCLUDE)) {
                    const includes = data[this.KEY_INCLUDE];
                    const path = file.substr(0, file.lastIndexOf("/") + 1);
                    let included = 0;

                    for (const include of includes)
                        this.load(() => {
                            if (++included === includes.length)
                                onFinish();
                        }, onFailure,path + include);
                }
                else if (onFinish)
                    onFinish();
            }
            else
                onFailure();
        }
    };

    request.send(null);
};