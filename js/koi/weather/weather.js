/**
 * The weather controller
 * @param {Constellation} constellation The constellation
 * @param {WeatherState} state The state of the weather object
 * @constructor
 */
const Weather = function(constellation, state) {
    this.gusts = new Gusts(constellation);
    this.state = state;
};

/**
 * Set the weather state
 * @param {WeatherState} state The weather state
 */
Weather.prototype.setState = function(state) {
    this.state = state;
};

/**
 * Get the weather state
 * @returns {WeatherState} The weather state
 */
Weather.prototype.getState = function() {
    return this.state;
};

/**
 * Update the weather
 * @param {Air} air The air
 * @param {Water} water The water
 * @param {Random} random A randomizer
 */
Weather.prototype.update = function(air, water, random) {
    this.gusts.update(air, random);
};