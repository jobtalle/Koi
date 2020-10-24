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
    this.effectWaterLow = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/AMB_WaterLow_", 1, 4, ".ogg"));
    this.effectWaterTop = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/AMB_WaterTop_", 1, 6, ".ogg"));

    this.ambientWaterTop = new AudioEffectPeriodic(1, this.effectWaterTop);
    this.ambientWaterLow = new AudioEffectPeriodic(1, this.effectWaterLow);
    this.ambientWind = new AudioLoop(engine, "audio/ogg/AMB_Wind.ogg");
    this.ambientOneShot = new AudioEffect(
        engine,
        this.enumerateSources("audio/ogg/AMB_EnvironmentOneShot_", 1, 28, ".ogg"));
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