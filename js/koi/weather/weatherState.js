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

WeatherState.prototype.STATE_TIME = 700;
WeatherState.prototype.ID_SUNNY = 0;
WeatherState.prototype.ID_OVERCAST = 1;
WeatherState.prototype.ID_DRIZZLE = 2;
WeatherState.prototype.ID_RAIN = 3;
WeatherState.prototype.ID_THUNDERSTORM = 4;
WeatherState.prototype.TRANSITION_MATRIX = [
    [         // Transitions from sunny weather
        0.5,  // Sunny
        0.3,  // Overcast
        0.2,  // Drizzle
        0,    // Rain
        0     // Thunderstorm
    ],
    [         // Transitions from overcast weather
        0.3,  // Sunny
        0.3,  // Overcast
        0.2,  // Drizzle
        0.1,  // Rain
        0.1   // Thunderstorm
    ],
    [         // Transitions from drizzle weather
        0.4,  // Sunny
        0.3,  // Overcast
        0.3,  // Drizzle
        0,    // Rain
        0     // Thunderstorm
    ],
    [         // Transitions from rain weather
        0.4,  // Sunny
        0.4,  // Overcast
        0,    // Drizzle
        0.2,  // Rain
        0     // Thunderstorm
    ],
    [         // Transitions from thunderstorm weather
        0.7,  // Sunny
        0.2,  // Overcast
        0,    // Drizzle
        0,    // Rain
        0.1   // Thunderstorm
    ]];

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

    if (Math.max(lastState, state) > WeatherState.prototype.ID_THUNDERSTORM)
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