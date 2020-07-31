/**
 * Mix fish patterns
 * @param {Pattern} mother The first fish pattern
 * @param {Pattern} father The second fish pattern
 * @constructor
 */
const MixerPattern = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerPattern.prototype = Object.create(Mixer.prototype);

/**
 * Create a new pattern that combines properties from both parents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Pattern} The mixed pattern
 */
MixerPattern.prototype.mix = function(atlas, randomSource, random) { // TODO: mix
    const layers = [];

    for (const layer of this.mother.layers) {
        switch (layer.ID) {
            case LayerSpots.prototype.ID:
                layers.push(new LayerSpots(layer.scale, layer.paletteSample, layer.anchor, layer.x));

                break;
        }
    }

    const pattern = new Pattern(
        new LayerBase(this.mother.base.paletteSample),
        layers,
        new LayerShapeBody(this.mother.shapeBody.centerPower, this.mother.shapeBody.radiusPower),
        new LayerShapeFin());

    atlas.write(pattern, randomSource);

    return pattern;
};