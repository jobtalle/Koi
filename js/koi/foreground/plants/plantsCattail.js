Plants.prototype.CATTAIL_COLOR_STALK = Color.fromCSS("cattail-stalk");
Plants.prototype.CATTAIL_COLOR_CAPSULE = Color.fromCSS("cattail-capsule");

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
    const flex = .2;
    const flexPower = 2.5;
    const height = 2.2;
    const capsuleStart = 1.2;
    const capsuleEnd = 2;
    const flexSampler = new Plants.FlexSampler(x, 0, flex, flexPower, height);

    this.modelCapsule(
        x,
        capsuleStart,
        x,
        capsuleEnd,
        y,
        .1,
        uv,
        this.CATTAIL_COLOR_CAPSULE,
        .8,
        flexSampler,
        vertices,
        indices);
    this.modelStalk(
        x,
        0,
        x,
        height,
        y,
        .05,
        uv,
        this.CATTAIL_COLOR_STALK,
        .8,
        flexSampler,
        vertices,
        indices);
};