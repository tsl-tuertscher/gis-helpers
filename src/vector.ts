/**
 * @classdesc
 * Basic vector class in R3
 */
export class Vector {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  /**
   * @param {number} x - component.
   * @param {number} y - component.
   * @param {number} z - component.
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * @param {Vector} vec - Vector to add.
   * @returns {Vector} New vector.
   */
  public add(vec: Vector): Vector {
    const result = new Vector(0, 0, 0);
    result.x = this.x + vec.x;
    result.y = this.y + vec.y;
    result.z = this.z + vec.z;
    return result;
  }

  /**
   * @param {Vector} vec - Vector to subtract.
   * @returns {Vector} New vector.
   */
  public sub(vec: Vector): Vector {
    const result = new Vector(0, 0, 0);
    result.x = this.x - vec.x;
    result.y = this.y - vec.y;
    result.z = this.z - vec.z;
    return result;
  }

  /**
   * @returns {number} Length of the vector.
   */
  public absoluteValue(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  }

  /**
   * @param {Vector} vec - Vector to multiplicate.
   * @returns {number} Dot product
   */
  public innerProduct(vec: Vector): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  /**
   * @param {Vector} vec - Vector to multiplicate.
   * @returns {Vector} Cross product
   */
  public vectorProduct(vec: Vector): Vector {
    return new Vector(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x,
    );
  }

  /**
   * @returns {Vector} Vector of length 1
   */
  public einheitsvektor(): Vector {
    const abs = this.absoluteValue();
    return new Vector(this.x / abs, this.y / abs, this.z / abs);
  }

  /**
   * @returns {Vector} Reverse vector
   */
  public reverse(): Vector {
    return new Vector(-this.x, -this.y, -this.z);
  }
}
