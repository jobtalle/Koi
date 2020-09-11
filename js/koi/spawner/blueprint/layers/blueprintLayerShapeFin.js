/**
 * A fin shape layer blueprint
 * @constructor
 */
const BlueprintLayerShapeFin = function() {

};

/**
 * Spawn a fin shape layer
 * @param {Random} random A randomizer
 * @returns {LayerShapeFin} A fin shape layer
 */
BlueprintLayerShapeFin.prototype.spawn = function(random) {
    return new LayerShapeFin();
};