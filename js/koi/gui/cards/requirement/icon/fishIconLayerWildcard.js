/**
 * A fish icon wildcard layer
 * @constructor
 */
const FishIconLayerWildcard = function() {
    FishIconLayer.call(this);
};

FishIconLayerWildcard.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayerWildcard.prototype.draw = function(group) {
    group.appendChild(this.createFilledLayer(this.ID_WILDCARD));
};