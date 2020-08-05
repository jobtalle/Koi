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
MixerPattern.prototype.LAYER_SKIP_CHANCE = .06;

/**
 * Mix two layers of the same type
 * @param {Layer} mother The mother layer
 * @param {Layer} father The father layer
 * @param {Random} random A randomizer
 * @returns {Layer} The mixed layers
 */
MixerPattern.prototype.mixLayers = function(mother, father, random) {
    switch (mother.id) {
        case LayerSpots.prototype.ID:
            return new MixerLayerSpots(mother, father).mix(random);
    }
};

/**
 * Create a new pattern that combines properties from both parents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Pattern} The mixed pattern
 */
MixerPattern.prototype.mix = function(atlas, randomSource, random) {
    const layers = [];
    const layersMother = this.mother.layers.length;
    const layersFather = this.father.layers.length;
    let layerMother = 0;
    let layerFather = 0;

    while (layerMother < layersMother || layerFather < layersFather) {
        const mother = layerMother >= layersMother ? null : this.mother.layers[layerMother];
        const father = layerFather >= layersFather ? null : this.father.layers[layerFather];

        if (mother === null)
            layers.push(father.copy());
        else if (father === null)
            layers.push(mother.copy());
        else if (mother.id === father.id)
            layers.push(this.mixLayers(mother, father, random));
        else {
            if (mother.isRecessive() === father.isRecessive()) {
                if (mother.sampleDominance(random) > father.sampleDominance(random))
                    layers.push(mother.copy());
                else
                    layers.push(father.copy());
            }
            else if (mother.isRecessive())
                layers.push(father.copy());
            else
                layers.push(mother.copy());
        }

        // TODO: Pattern order swaps

        // TODO: This may allow recessive patterns to win, probably not desirable
        if (random.getFloat() < this.LAYER_SKIP_CHANCE)
            layerMother += 2;
        else
            ++layerMother;

        if (random.getFloat() < this.LAYER_SKIP_CHANCE)
            layerFather += 2;
        else
            ++layerFather;
    }

    const pattern = new Pattern(
        new MixerLayerBase(this.mother.base, this.father.base).mix(random),
        layers,
        new MixerLayerShapeBody(this.mother.shapeBody, this.father.shapeBody).mix(random),
        new LayerShapeFin());

    atlas.write(pattern, randomSource);

    return pattern;
};