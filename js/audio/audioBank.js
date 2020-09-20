/**
 * A collection of all usable game audio
 * @param {AudioEngine} engine The audio engine
 * @constructor
 */
const AudioBank = function(engine) {
    this.effectFishUp = new AudioEffect(engine, [
        "audio/ogg/SFX_Splash_01.ogg",
        "audio/ogg/SFX_Splash_02.ogg",
        "audio/ogg/SFX_Splash_03.ogg",
        "audio/ogg/SFX_Splash_04.ogg",
        "audio/ogg/SFX_Splash_05.ogg",
        "audio/ogg/SFX_Splash_06.ogg",
        "audio/ogg/SFX_Splash_07.ogg",
        "audio/ogg/SFX_Splash_08.ogg",
        "audio/ogg/SFX_Splash_09.ogg",
        "audio/ogg/SFX_Splash_10.ogg"
    ]);

    this.effectFishDown = this.effectFishUp;
};