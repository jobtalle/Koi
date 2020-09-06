/**
 * The state of a weather object
 * @param {Number} [state] The state ID
 * @param {Number} [time] The current state time
 * @constructor
 */
const WeatherState = function(state = this.ID_SUNNY, time = 0) {
    this.state = state;
    this.time = time;
};

WeatherState.prototype.STATE_TIME = 200;
WeatherState.prototype.ID_SUNNY = 0;
WeatherState.prototype.ID_RAIN = 1;
WeatherState.prototype.TRANSITION_MATRIX = [
    [0, 1],
    [1, 0]];

/**
 * Deserialize the weather state
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {WeatherState} The deserialized weather state
 * @throws {RangeError} A range error when deserialized values are out of range
 */
WeatherState.deserialize = function(buffer) {
    const combined = buffer.readUint16();
    const state = (combined & 0xF000) >> 12;
    const time = combined & 0x0FFF;

    if (state > WeatherState.prototype.ID_RAIN)
        throw new RangeError();

    if (time > WeatherState.prototype.STATE_TIME)
        throw new RangeError();

    return new WeatherState(state, time);
};

/**
 * Serialize the weather state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
WeatherState.prototype.serialize = function(buffer) {
    buffer.writeUint16((this.state << 12) | this.time);
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

/**
 * Update the weather state
 * @param {Random} random A randomizer
 * @returns {Boolean} True if the state has changed
 */
WeatherState.prototype.update = function(random) {
    if (++this.time === this.STATE_TIME) {
        this.time = 0;

        return this.transition(random);
    }

    return false;
};