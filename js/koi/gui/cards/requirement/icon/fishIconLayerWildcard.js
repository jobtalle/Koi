/**
 * A fish icon wildcard layer
 * @constructor
 */
const FishIconLayerWildcard = function() {

};

FishIconLayerWildcard.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 * @param {Number} index The layer index
 */
FishIconLayerWildcard.prototype.draw = function(group, index) {
    group.appendChild(this.createFilledLayer(this.ID_WILDCARD));
};