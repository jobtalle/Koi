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

    this.effectFishDown = new AudioEffect(engine, [
        "audio/ogg/SFX_WaterImpact_01.ogg",
        "audio/ogg/SFX_WaterImpact_02.ogg",
        "audio/ogg/SFX_WaterImpact_03.ogg",
        "audio/ogg/SFX_WaterImpact_04.ogg",
        "audio/ogg/SFX_WaterImpact_05.ogg",
        "audio/ogg/SFX_WaterImpact_06.ogg"
    ]);

    this.effectWaterLow = new AudioEffect(engine, [
        "audio/ogg/AMB_WaterLow_01.ogg",
        "audio/ogg/AMB_WaterLow_02.ogg",
        "audio/ogg/AMB_WaterLow_03.ogg",
        "audio/ogg/AMB_WaterLow_04.ogg"
    ]);

    this.effectWaterTop = new AudioEffect(engine, [
        "audio/ogg/AMB_WaterTop_01.ogg",
        "audio/ogg/AMB_WaterTop_02.ogg",
        "audio/ogg/AMB_WaterTop_03.ogg",
        "audio/ogg/AMB_WaterTop_04.ogg",
        "audio/ogg/AMB_WaterTop_05.ogg",
        "audio/ogg/AMB_WaterTop_06.ogg"
    ]);

    this.ambientWaterTop = new AudioEffectPeriodic(1, this.effectWaterTop);
    this.ambientWaterLow = new AudioEffectPeriodic(1, this.effectWaterLow);
    this.ambientWind = new AudioLoop(engine, "audio/ogg/AMB_Wind.ogg");

};