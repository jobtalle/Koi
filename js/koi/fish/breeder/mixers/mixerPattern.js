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
        case LayerRidge.prototype.ID:
            return new MixerLayerRidge(mother, father).mix(random);
        case LayerStripes.prototype.ID:
            return new MixerLayerStripes(mother, father).mix(random);
    }
};

/**
 * Check if two patterns are of the same types and colors
 * @param {Pattern} a The first pattern
 * @param {Pattern} b The second pattern
 * @returns {Boolean} True if both patterns contain the same types of layers in the same order
 */
MixerPattern.prototype.patternsEqual = function(a, b) {
    if (a.layers.length !== b.layers.length)
        return false;

    if (a.base.id !== b.base.id || a.base.paletteIndex !== b.base.paletteIndex)
        return false;

    for (let layer = 0, layers = a.layers.length; layer < layers; ++layer)
        if (a.layers[layer].id !== b.layers[layer].id || a.layers[layer].paletteIndex !== b.layers[layer].paletteIndex)
            return false;

    return true;
};

/**
 * Create a new pattern that combines properties from both parents
 * @param {Patterns} patterns The pattern renderer
 * @param {Random} random A randomizer
 * @returns {Pattern} The mixed pattern
 */
MixerPattern.prototype.mix = function(patterns, random) {
    let base = null;
    const shapeBody = new MixerLayerShapeBody(this.mother.shapeBody, this.father.shapeBody).mix(random);
    const shapeFins = new MixerLayerShapeFin(this.mother.shapeFin, this.father.shapeFin).mix(random);
    const layers = [];

    if (this.patternsEqual(this.mother, this.father)) {
        base = new MixerLayerBase(this.mother.base, this.father.base).mix(random);

        for (let layer = 0, layerCount = this.mother.layers.length; layer < layerCount; ++layer)
            layers.push(this.mixLayers(this.mother.layers[layer], this.father.layers[layer], random));
    }
    else {
        for (const mutation of Mutations) if (mutation.mutates(this.mother, this.father, random))
            return mutation.apply(
                this.mother,
                this.father,
                shapeBody,
                shapeFins,
                this.mixLayers.bind(this),
                random);

        // TODO: Dominance
        if (random.getFloat() < .5) {
            base = this.mother.base.copy();

            for (const layer of this.mother.layers)
                layers.push(layer.copy());
        }
        else {
            base = this.father.base.copy();

            for (const layer of this.father.layers)
                layers.push(layer.copy())
        }
    }

    const pattern = new Pattern(
        base,
        layers,
        shapeBody,
        shapeFins);

    pattern.trim(patterns.palettes.base);

    return pattern;
};