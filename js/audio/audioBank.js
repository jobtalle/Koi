/**
 * A collection of all usable game audio
 * @param {AudioEngine} engine The audio engine
 * @param {String} [format] The audio file format, wav or ogg
 * @constructor
 */
const AudioBank = function(engine, format = "wav") {
    this.effectFishUp = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_Splash_", 1, 10, "." + format));
    this.effectFishDown = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_WaterImpact_", 1, 6, "." + format));
    this.effectFishMoveSmall = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_SmallFishMove_", 1, 5, "." + format));
    this.effectFishMoveBig = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_BigFishMove_", 1, 8, "." + format));
    this.effectFishTailSmall = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_SmallUnderwaterMovement_", 1, 10, "." + format));
    this.effectFishTailBig = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_BigUnderwaterMovement_", 1, 9, "." + format));
    this.effectFishTailFast = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_FastUnderwaterMovement_", 1, 8, "." + format));
    this.effectGust = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_WindGust_", 1, 5, "." + format));
    this.effectGrass = new AudioEffectGranular(
        Koi.prototype.UPDATE_RATE,
        0.5,
        new SamplerPower(0.7, 1.4, 0.5),
        new AudioEffect(
            engine,
            this.enumerateSources("audio/" + format + "/SFX_GrassInteract_", 1, 22, "." + format)));
    this.effectClick = new AudioEffect(engine, "audio/" + format + "/SFX_Click." + format);
    this.effectNegative = new AudioEffect(engine, "audio/" + format + "/SFX_Negative." + format);
    this.effectBookInteract = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_BookInteract_", 1, 6, "." + format));
    this.effectCardInteract = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_CardInteract_", 1, 5, "." + format));
    this.effectPageTurn = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/SFX_PageTurn_", 1, 6, "." + format));

    this.ambientWaterTop = new AudioEffectPeriodic(
        1,
        new AudioEffect(
            engine,
            this.enumerateSources("audio/" + format + "/AMB_WaterTop_", 1, 6, "." + format)));
    this.ambientWaterLow = new AudioEffectPeriodic(
        1,
        new AudioEffect(
            engine,
            this.enumerateSources("audio/" + format + "/AMB_WaterLow_", 1, 4, "." + format)));
    this.ambientWind = new AudioEffectPeriodic(
        1,
        new AudioEffect(engine, "audio/" + format + "/AMB_Wind." + format));
    this.ambientBirds = new AudioEffectPeriodic(
        2,
        new AudioEffect(
            engine,
            this.enumerateSources("audio/" + format + "/Amb_BirdAmbience_", 1, 5, "." + format)));
    this.ambientOneShot = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/AMB_EnvironmentOneShot_", 1, 28, "." + format));
    this.ambientThunder = new AudioEffect(
        engine,
        this.enumerateSources("audio/" + format + "/AMB_Thunder_", 1, 4, "." + format));
    this.ambientRainLight = new AudioEffectPeriodicBounded(
        2,
        new AudioEffect(engine, "audio/" + format + "/AMB_Rain_Start." + format),
        new AudioEffect(engine, "audio/" + format + "/AMB_Rain_Loop." + format),
        new AudioEffect(engine, "audio/" + format + "/AMB_Rain_Stop." + format));
    this.ambientRainHeavy = new AudioEffectPeriodicBounded(
        2,
        new AudioEffect(engine, "audio/" + format + "/AMB_RainHeavy_Start." + format),
        new AudioEffect(engine, "audio/" + format + "/AMB_RainHeavy_Loop." + format),
        new AudioEffect(engine, "audio/" + format + "/AMB_RainHeavy_Stop." + format));
    this.ambientCrickets = [
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsA_Start." + format),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/" + format + "/AMB_CricketsA_Loop_", 1, 4, "." + format)),
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsA_Stop." + format)),
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsB_Start." + format),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/" + format + "/AMB_CricketsB_Loop_", 1, 4, "." + format)),
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsB_Stop." + format)),
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsC_Start." + format),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/" + format + "/AMB_CricketsC_Loop_", 1, 4, "." + format)),
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsC_Stop." + format)),
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsD_Start." + format),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/" + format + "/AMB_CricketsD_Loop_", 1, 4, "." + format)),
            new AudioEffect(engine, "audio/" + format + "/AMB_CricketsD_Stop." + format))
    ];
};

/**
 * Generate an array of source file names with numbering
 * @param {String} name The first part of the file name
 * @param {Number} first The first number
 * @param {Number} last The last number
 * @param {String} extension The file extension, which is the part after the number
 * @param {Number} [padding] The number of symbols to pad the numbers to, 2 by default
 * @returns {String[]} An array of source file names
 */
AudioBank.prototype.enumerateSources = function(
    name,
    first,
    last,
    extension,
    padding = 2) {
    const sources = [];

    for (let n = first; n <= last; ++n) {
        let nString = n.toString();

        while (nString.length < padding)
            nString = "0" + nString;

        sources.push(name + nString + extension);
    }

    return sources;
};