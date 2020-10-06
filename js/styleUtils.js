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
        const value = StyleUtils.get(name);

        if (value.endsWith("px"))
            return Number.parseInt(value.substr(0, value.length - 2));

        return -1;
    }
};