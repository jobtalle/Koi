Plants.prototype.CATTAIL_COLOR_STALK = Color.fromCSS("cattail-stalk");

/**
 * Model cattail
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelCattail = function(x, y, random, vertices, indices) {
    const uv = this.makeUV(x, y, random);

    this.modelStalk(
        x,
        0,
        x,
        1.5,
        y,
        .05,
        uv,
        this.CATTAIL_COLOR_STALK,
        .8,
        .2,
        2.5,
        vertices,
        indices);
};