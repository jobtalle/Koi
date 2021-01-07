/**
 * A metric to imperial units converter
 * @constructor
 */
const Units = {
    /**
     * Convert kilograms to pounds
     * @param {Number} kilograms The number in kilograms
     * @returns {Number} The number in pounds
     */
    toPounds: function(kilograms) {
        return kilograms * 2.20462;
    },

    /**
     * Convert centimeters to feet
     * @param {Number} centimeters The number in centimeters
     * @returns {Number} The number in feet
     */
    toFeet: function(centimeters) {
        return centimeters * 0.0328084;
    }
};