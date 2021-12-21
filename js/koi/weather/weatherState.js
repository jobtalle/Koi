/**
 * The state of a weather object
 * @param {Number} [lastState] The previous state ID
 * @param {Number} [state] The state ID
 * @param {Number} [time] The current state time
 * @param {Number} [timeOneShot] The time until the next one shot sound effect
 * @param {Number} [timeCrickets] The time until a cricket effect should be stopped
 * @param {Number} [cricketsIndex] The index of the currently active crickets
 * @constructor
 */
const WeatherState = function(
    lastState = this.ID_SUNNY,
    state = this.ID_SUNNY,
    time = 0,
    timeOneShot = 1,
    timeCrickets = 0,
    cricketsIndex = 0) {
    this.lastState = lastState;
    this.state = state;
    this.time = time;
    this.timeOneShot = timeOneShot;
    this.timeCrickets = timeCrickets;
    this.cricketsIndex = cricketsIndex;
    this.initialized = false;
};

WeatherState.prototype.STATE_TIME = 600;
WeatherState.prototype.CRICKET_TIME = 350;
WeatherState.prototype.CRICKET_COUNT = 4;
WeatherState.prototype.ID_SUNNY = 0;
WeatherState.prototype.ID_OVERCAST = 1;
WeatherState.prototype.ID_DRIZZLE = 2;
WeatherState.prototype.ID_RAIN = 3;
WeatherState.prototype.ID_THUNDERSTORM = 4;
WeatherState.prototype.SAMPLER_ONE_SHOT_TIME = new SamplerPower(20, 150, 0.3);
WeatherState.prototype.SAMPLER_ONE_SHOT_PAN = new Sampler(-.8, .8);
WeatherState.prototype.ONE_SHOT_VOLUME_SUPPRESION = .7;
WeatherState.prototype.TRANSITION_MATRIX = [
    [         // Transitions from sunny weather
        0.6,  // Sunny
        0.3,  // Overcast
        0.1,  // Drizzle
        0,    // Rain
        0     // Thunderstorm
    ],
    [         // Transitions from overcast weather
        0.4,  // Sunny
        0.2,  // Overcast
        renderSnow ? 0.25 : 0.15, // Drizzle
        0.15, // Rain
        renderSnow ? 0 : 0.1   // Thunderstorm
    ],
    [         // Transitions from drizzle weather
        0.4,  // Sunny
        0.4,  // Overcast
        0.2,  // Drizzle
        0,    // Rain
        0     // Thunderstorm
    ],
    [         // Transitions from rain weather
        0.3,  // Sunny
        0.4,  // Overcast
        0,    // Drizzle
        0.3,  // Rain
        0     // Thunderstorm
    ],
    [         // Transitions from thunderstorm weather
        0.5,  // Sunny
        0.2,  // Overcast
        0,    // Drizzle
        0,    // Rain
        0.3   // Thunderstorm
    ]
];

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
    const timeOneShot = buffer.readUint8();
    const timeCrickets = buffer.readUint16();
    const cricketsIndex = buffer.readUint8();

    if (Math.max(lastState, state) > WeatherState.prototype.ID_THUNDERSTORM)
        throw new RangeError();

    if (time > WeatherState.prototype.STATE_TIME)
        throw new RangeError();

    if (timeOneShot > WeatherState.prototype.SAMPLER_ONE_SHOT_TIME.max)
        throw new RangeError();

    if (timeCrickets > WeatherState.prototype.CRICKET_TIME)
        throw new RangeError();

    if (cricketsIndex > WeatherState.prototype.CRICKET_COUNT)
        throw new RangeError();

    return new WeatherState(lastState, state, time, timeOneShot, timeCrickets, cricketsIndex);
};

/**
 * Serialize the weather state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
WeatherState.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.lastState);
    buffer.writeUint8(this.state);
    buffer.writeUint16(this.time);
    buffer.writeUint8(this.timeOneShot);
    buffer.writeUint16(this.timeCrickets);
    buffer.writeUint8(this.cricketsIndex);
};

/**
 * Get the time until the next transition
 * @returns {Number} The time until the next transition in updates
 */
WeatherState.prototype.timeToTransition = function() {
    return this.STATE_TIME - this.time;
};

/**
 * Go to a new weather state
 * @param {AudioBank} audio Game audio
 * @param {Random} random A randomizer
 * @returns {Boolean} A boolean indicating whether the state changed
 */
WeatherState.prototype.transition = function(audio, random) {
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

        switch (statePrevious) {
            case this.ID_DRIZZLE:
            case this.ID_RAIN:
                if (!renderSnow)
                    audio.ambientRainLight.stop();

                break;
            case this.ID_THUNDERSTORM:
                this.cricketsIndex = Math.floor(random.getFloat() * this.CRICKET_COUNT);
                this.timeCrickets = this.CRICKET_TIME;

                audio.ambientCrickets[this.cricketsIndex].play();

                if (!renderSnow)
                    audio.ambientRainHeavy.stop();

                break;
        }

        switch (this.state) {
            case this.ID_DRIZZLE:
            case this.ID_RAIN:
                if (!renderSnow)
                    audio.ambientRainLight.play();

                break;
            case this.ID_THUNDERSTORM:
                if (!renderSnow)
                    audio.ambientRainHeavy.play();

                break;
        }

        return true;
    }

    return false;
};

/**
 * Initialize the weather state after deserialization
 * @param {AudioBank} audio Game audio
 */
WeatherState.prototype.initialize = function(audio) {
    if (this.timeCrickets !== 0)
        audio.ambientCrickets[this.cricketsIndex].playBody();

    switch (this.state) {
        case this.ID_DRIZZLE:
        case this.ID_RAIN:
            if (!renderSnow)
                audio.ambientRainLight.playBody();

            break;
        case this.ID_THUNDERSTORM:
            if (!renderSnow)
                audio.ambientRainHeavy.playBody();

            break;
    }
};

/**
 * Update the weather state
 * @param {AudioBank} audio Game audio
 * @param {Random} random A randomizer
 * @returns {Boolean} True if the state has changed
 */
WeatherState.prototype.update = function(audio, random) {
    if (!this.initialized) {
        this.initialize(audio);

        this.initialized = true;
    }

    audio.ambientCrickets[this.cricketsIndex].update(Koi.prototype.UPDATE_RATE);
    audio.ambientRainLight.update(Koi.prototype.UPDATE_RATE);
    audio.ambientRainHeavy.update(Koi.prototype.UPDATE_RATE);

    if (this.timeCrickets !== 0) if (--this.timeCrickets === 0)
        audio.ambientCrickets[this.cricketsIndex].stop();

    if (++this.time === this.STATE_TIME) {
        this.time = 0;

        return this.transition(audio, random);
    }

    if (--this.timeOneShot === 0) {
        const pan = this.SAMPLER_ONE_SHOT_PAN.sample(random.getFloat());
        const volume = 1 - Math.abs(pan) * this.ONE_SHOT_VOLUME_SUPPRESION;

        switch (this.state) {
            case this.ID_SUNNY:
            case this.ID_OVERCAST:
            case this.ID_DRIZZLE:
                if (this.timeCrickets === 0) {
                    if (renderSnow && random.getFloat() < .15)
                        audio.ambientChristmas.play(pan, volume * .3);
                    else
                        audio.ambientOneShot.play(pan, volume);
                }

                break;
        }

        this.timeOneShot = Math.round(this.SAMPLER_ONE_SHOT_TIME.sample(random.getFloat()));
    }

    return false;
};

/**
 * Check whether it's raining significantly
 * @returns {Boolean} True if it's raining
 */
WeatherState.prototype.isRaining = function() {
    return this.state === this.ID_RAIN || this.state === this.ID_THUNDERSTORM;
};

/**
 * Check whether it's slightly raining
 * @returns {Boolean} True if it's slightly raining
 */
WeatherState.prototype.isDrizzle = function() {
    return this.state === this.ID_DRIZZLE;
};