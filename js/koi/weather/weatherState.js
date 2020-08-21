/**
 * The state of a weather object
 * @param {Number} [state] The state ID
 * @constructor
 */
const WeatherState = function(state = this.ID_SUNNY) {
    this.state = state;
};

WeatherState.prototype.ID_SUNNY = 0;
WeatherState.prototype.ID_RAIN = 1;

/**
 * Serialize the weather state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
WeatherState.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.state);
};

/**
 * Deserialize the weather state
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {WeatherState} The deserialized weather state
 */
WeatherState.deserialize = function(buffer) {
    const state = buffer.readUint8();

    if (state > WeatherState.prototype.ID_RAIN)
        throw new RangeError();

    return new WeatherState(state);
};