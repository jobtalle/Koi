/**
 * A collection of all usable game audio
 * @param {AudioEngine} engine The audio engine
 * @constructor
 */
const AudioBank = function(engine) {
    this.effectFishUp = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_Splash_", 1, 10, ".ogg"));
    this.effectFishDown = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_WaterImpact_", 1, 6, ".ogg"));
    this.effectFishMoveSmall = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_SmallFishMove_", 1, 5, ".ogg"));
    this.effectFishMoveBig = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_BigFishMove_", 1, 8, ".ogg"));
    this.effectFishTailSmall = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_SmallUnderwaterMovement_", 1, 10, ".ogg"));
    this.effectFishTailBig = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_BigUnderwaterMovement_", 1, 9, ".ogg"));
    this.effectFishTailFast = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_FastUnderwaterMovement_", 1, 8, ".ogg"));
    this.effectGust = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_WindGust_", 1, 5, ".ogg"));
    this.effectGrass = new AudioEffectGranular(
        Koi.prototype.UPDATE_RATE,
        0.5,
        new SamplerPower(0.7, 1.4, 0.5),
        new AudioEffect(
            engine,
            this.enumerateSources("audio/ogg/SFX_GrassInteract_", 1, 22, ".ogg")));
    this.effectClick = new AudioEffect(
        engine,
        ["audio/ogg/SFX_Click.ogg", "audio/ogg/SFX_Click.ogg", "audio/ogg/SFX_Click.ogg"]); // TODO: Really fix this
    this.effectNegative = new AudioEffect(
        engine,
        ["audio/ogg/SFX_Negative.ogg", "audio/ogg/SFX_Negative.ogg", "audio/ogg/SFX_Negative.ogg"]);
    this.effectBookInteract = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_BookInteract_", 1, 6, ".ogg"));
    this.effectCardInteract = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_CardInteract_", 1, 5, ".ogg"));
    this.effectPageTurn = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/SFX_PageTurn_", 1, 6, ".ogg"));

    this.ambientWaterTop = new AudioEffectPeriodic(
        1,
        new AudioEffect(
            engine,
            this.enumerateSources("audio/ogg/AMB_WaterTop_", 1, 6, ".ogg")));
    this.ambientWaterLow = new AudioEffectPeriodic(
        1,
        new AudioEffect(
            engine,
            this.enumerateSources("audio/ogg/AMB_WaterLow_", 1, 4, ".ogg")));
    this.ambientWind = new AudioEffectPeriodic(
        1,
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_Wind.ogg", "audio/ogg/AMB_Wind.ogg"]));
    this.ambientBirds = new AudioEffectPeriodic(
        1,
        new AudioEffect(
            engine,
            this.enumerateSources("audio/ogg/Amb_BirdAmbience_", 1, 5, ".ogg")));
    this.ambientOneShot = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/AMB_EnvironmentOneShot_", 1, 28, ".ogg"));
    this.ambientThunder = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/AMB_Thunder_", 1, 4, ".ogg"));
    this.ambientRainLight = new AudioEffectPeriodicBounded(
        2,
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_Rain_Start.ogg"]),
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_Rain_Loop.ogg", "audio/ogg/AMB_Rain_Loop.ogg"]), // TODO: Allow overlapping sound
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_Rain_Stop.ogg"]));
    this.ambientRainHeavy = new AudioEffectPeriodicBounded(
        2,
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_RainHeavy_Start.ogg"]),
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_RainHeavy_Loop.ogg", "audio/ogg/AMB_RainHeavy_Loop.ogg"]), // TODO: Allow overlapping sound
        new AudioEffect(
            engine,
            ["audio/ogg/AMB_RainHeavy_Stop.ogg"]));
    this.ambientCrickets = [
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsA_Start.ogg"]),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/ogg/AMB_CricketsA_Loop_", 1, 4, ".ogg")),
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsA_Stop.ogg"])),
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsB_Start.ogg"]),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/ogg/AMB_CricketsB_Loop_", 1, 4, ".ogg")),
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsB_Stop.ogg"])),
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsC_Start.ogg"]),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/ogg/AMB_CricketsC_Loop_", 1, 4, ".ogg")),
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsC_Stop.ogg"])),
        new AudioEffectPeriodicBounded(
            3,
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsD_Start.ogg"]),
            new AudioEffect(
                engine,
                this.enumerateSources("audio/ogg/AMB_CricketsD_Loop_", 1, 4, ".ogg")),
            new AudioEffect(
                engine,
                ["audio/ogg/AMB_CricketsD_Stop.ogg"]))
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