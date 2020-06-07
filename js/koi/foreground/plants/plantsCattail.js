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
    const flexCapsuleStart = this.makeFlexVector(flex * Math.pow(capsuleStart / height, flexPower), x, 1, x, 0);
    const flexCapsuleEnd = this.makeFlexVector(flex * Math.pow(capsuleEnd / height, flexPower), x, 1.3, x, 0);

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
        flexCapsuleStart,
        flexCapsuleEnd,
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
        flex,
        2.5,
        vertices,
        indices);
};