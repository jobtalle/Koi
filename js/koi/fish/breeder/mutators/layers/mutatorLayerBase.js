/**
 * Mutate a base layer in place
 * @param {LayerBase} layer The base layer
 * @constructor
 */
const MutatorLayerBase = function(layer) {
    MutatorLayer.call(this, layer);
};

MutatorLayerBase.prototype = Object.create(MutatorLayer.prototype);