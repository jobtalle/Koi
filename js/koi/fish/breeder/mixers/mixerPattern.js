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
 * Mutate a layer
 * @param {Layer} layer A layer
 * @param {Random} random A randomizer
 * @returns {Layer} The given layer
 */
MixerPattern.prototype.mutate = function(layer, random) {
    switch (layer.id) {
        case LayerSpots.prototype.ID:
            MixerLayerSpots.mutate(layer, random);

            break;
    }

    return layer;
};

/**
 * Mix two layers of the same type
 * @param {Layer} mother The mother layer
 * @param {Layer} father The father layer
 * @param {Random} random A randomizer
 * @returns {Layer} The mixed layers
 */
MixerPattern.prototype.mixLayers = function(mother, father, random) {
    let layer = null;

    switch (mother.id) {
        case LayerSpots.prototype.ID:
            layer = new MixerLayerSpots(mother, father).mix(random);
    }

    return this.mutate(layer, random);
};

/**
 * Create a new pattern that combines properties from both parents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Pattern} The mixed pattern
 */
MixerPattern.prototype.mix = function(atlas, randomSource, random) { // TODO: mix
    const layers = [];
    const layersMother = this.mother.layers.length;
    const layersFather = this.father.layers.length;
    let layerMother = 0;
    let layerFather = 0;

    while (layerMother < layersMother || layerFather < layersFather) {
        const mother = layerMother >= layersMother ? null : this.mother.layers[layerMother];
        const father = layerFather >= layersFather ? null : this.father.layers[layerFather];

        if (mother === null)
            layers.push(this.mutate(father.copy(), random));
        else if (father === null)
            layers.push(this.mutate(mother.copy(), random));
        else if (mother.id === father.id)
            layers.push(this.mixLayers(mother, father, random));
        else {
            if (mother.isRecessive() === father.isRecessive()) {
                if (mother.sampleDominance(random) > father.sampleDominance(random))
                    layers.push(this.mutate(mother.copy(), random));
                else
                    layers.push(this.mutate(father.copy(), random));
            }
            else if (mother.isRecessive())
                layers.push(this.mutate(father.copy(), random));
            else
                layers.push(this.mutate(mother.copy(), random));
        }

        if (random.getFloat() < this.LAYER_SKIP_CHANCE)
            layerMother += 2;
        else
            ++layerMother;

        if (random.getFloat() < this.LAYER_SKIP_CHANCE)
            layerFather += 2;
        else
            ++layerFather;
    }

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