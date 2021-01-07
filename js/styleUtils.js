const StyleUtils = {
    /**
     * Get a CSS variable
     * @param {String} name The full css variable name
     * @returns {String} The string associated with this variable
     */
    get: name => {
        return getComputedStyle(document.body).getPropertyValue(name).trim();
    },

    /**
     * Get a CSS variable as an integer
     * @param {String} name The full css variable name
     * @returns {Number} The integer associated with this variable
     */
    getInt: name => {
        return Number.parseInt(StyleUtils.get(name));
    },

    /**
     * Get a CSS variable as a float
     * @param {String} name The full css variable name
     * @returns {Number} The float associated with this variable
     */
    getFloat: name => {
        return Number.parseFloat(StyleUtils.get(name));
    }
};