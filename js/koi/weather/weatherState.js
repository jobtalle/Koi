/**
 * The state of a weather object
 * @param {Number} [lastState] The previous state ID
 * @param {Number} [state] The state ID
 * @param {Number} [time] The current state time
 * @constructor
 */
const WeatherState = function(lastState = this.ID_SUNNY, state = this.ID_SUNNY, time = 0) {
    this.lastState = lastState;
    this.state = state;
    this.time = time;
};

WeatherState.prototype.STATE_TIME = 70;
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
    const lastState = buffer.readUint8();
    const state = buffer.readUint8();
    const time = buffer.readUint16();

    if (Math.max(lastState, state) > WeatherState.prototype.ID_RAIN)
        throw new RangeError();

    if (time > WeatherState.prototype.STATE_TIME)
        throw new RangeError();

    return new WeatherState(lastState, state, time);
};

/**
 * Serialize the weather state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
WeatherState.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.lastState);
    buffer.writeUint8(this.state);
    buffer.writeUint16(this.time);
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

    if (statePrevious !== this.state) {
        this.lastState = statePrevious;

        return true;
    }

    return false;
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