/**
 * A 3D plane for sampling 3D volumes
 * @param {Number} stretch The X axis stretch factor in the range [0, 255]
 * @param {Vector3} anchor The plane center
 * @param {Vector3} x The normalized X direction vector
 * @constructor
 */
const Plane = function(stretch, anchor, x) {
    this.stretch = stretch;
    this.anchor = anchor;
    this.x = x;
};

Plane.prototype = Object.create(NumericManipulator.prototype);
Plane.prototype.SPACE_LIMIT_MIN = Math.fround(-256);
Plane.prototype.SPACE_LIMIT_MAX = Math.fround(256);

/**
 * Deserialize a plane
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {Plane} The deserialized plane
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Plane.deserialize = function(buffer) {
    const stretch = buffer.readUint8();
    const anchor = new Vector3().deserialize(buffer);
    const x = new Vector3().deserialize(buffer);

    if (!anchor.withinLimits(Plane.prototype.SPACE_LIMIT_MIN, Plane.prototype.SPACE_LIMIT_MAX))
        throw new RangeError();

    if (!x.isNormal())
        throw new RangeError();

    return new Plane(stretch, anchor, x);
};

/**
 * Make an interpolation of this plane and another one
 * @param {Plane} other Another plane
 * @param {Number} x The interpolation factor in the range [0, 1]
 */
Plane.prototype.interpolate = function(other, x) {
    return new Plane(
        this.clampUint8(this.stretch + (other.stretch - this.stretch) * x),
        this.anchor.interpolate(other.anchor, x),
        this.x.interpolate(other.x, x).normalize());
};

/**
 * Clamp the anchor within the valid space limits
 */
Plane.prototype.clampAnchor = function() {
    this.clampVector3(this.anchor, this.SPACE_LIMIT_MIN, this.SPACE_LIMIT_MAX);
};

/**
 * Make a deep copy of this plane
 * @returns {Plane} A copy of this plane
 */
Plane.prototype.copy = function() {
    return new Plane(this.stretch, this.anchor.copy(), this.x.copy());
};

/**
 * Serialize the plane
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Plane.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.stretch);

    this.anchor.serialize(buffer);
    this.x.serialize(buffer);
};

/**
 * Make a rotation matrix for this plane
 * @param {Sampler} stretchSampler A sampler for the stretch amount
 * @returns {Number[]} An array containing the rotation matrix
 */
Plane.prototype.makeMatrix = function(stretchSampler) {
    const stretch = stretchSampler.sample(this.stretch / 0xFF);
    const z = this.x.makeOrthogonal();
    const y = this.x.cross(z);

    return [
        this.x.x * stretch, this.x.y * stretch, this.x.z * stretch,
        y.x, y.y, y.z,
        z.x, z.y, z.z];
};