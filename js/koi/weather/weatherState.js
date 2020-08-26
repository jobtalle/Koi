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
WeatherState.prototype.TRANSITION_MATRIX = [
    [.5, .5],
    [.5, .5]];

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

/**
 * Serialize the weather state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
WeatherState.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.state);
};

/**
 * Go to a new weather state
 * @param {Random} random A randomizer
 * @returns {Boolean} A boolean indicating whether the state changed
 */
WeatherState.prototype.transition = function(random) {
    const statePrevious = this.state;
    const randomValue = random.getFloat();
    let chanceSum = 0;

    for (let next = 0, nextCount = this.TRANSITION_MATRIX[this.state].length; next < nextCount; ++next) {
        chanceSum += this.TRANSITION_MATRIX[this.state][next];

        if (randomValue < chanceSum) {
            this.state = next;

            break;
        }
    }

    return statePrevious !== this.state;
};