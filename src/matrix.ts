import { Vector } from './vector'

/**
 * @classdesc
 * Basic matrix class in R3
 */
 export class Matrix {
    public parameters: number[][];
  
    /**
     * @param {number[][]} parameters - Parameters of the matrix.
     */
    constructor(parameters?: number[][]) {
        if (parameters) {
            this.parameters = parameters;
            
        } else {
            this.parameters= [
                [],
                [],
                []
            ]
        }
    }

    /**
     * @param {Vector} vec - Vector to subtract.
     * @returns {Vector} New vector.
     */
    public multiple(vec: Vector): Vector {
      const result = new Vector(0, 0, 0);
      result.x = this.parameters[0][0] * vec.x + this.parameters[0][1] * vec.y + this.parameters[0][2] * vec.z;
      result.y = this.parameters[1][0] * vec.x + this.parameters[1][1] * vec.y + this.parameters[1][2] * vec.z;
      result.z = this.parameters[2][0] * vec.x + this.parameters[2][1] * vec.y + this.parameters[2][2] * vec.z;
      return result;
    }

    /**
     * @param {number} alpha - Angle in radiands
     */
    public setRotationsMatrixX(alpha: number): void {
        this.parameters[0][0] = 1;
        this.parameters[0][1] = 0;
        this.parameters[0][2] = 0;

        this.parameters[1][0] = 0;
        this.parameters[1][1] = Math.cos(alpha);
        this.parameters[1][2] = -Math.sin(alpha);

        this.parameters[2][0] = 0;
        this.parameters[2][1] = Math.sin(alpha);
        this.parameters[2][2] = Math.cos(alpha);
    }

    /**
     * @param {number} alpha - Angle in radiands
     */
    public setRotationsMatrixY(alpha: number): void {
        this.parameters[0][0] = Math.cos(alpha);
        this.parameters[0][1] = 0;
        this.parameters[0][2] = Math.sin(alpha);

        this.parameters[1][0] = 0;
        this.parameters[1][1] = 1;
        this.parameters[1][2] = 0;

        this.parameters[2][0] = -Math.sin(alpha);
        this.parameters[2][1] = 0;
        this.parameters[2][2] = Math.cos(alpha);
    }
  
    /**
     * @param {number} alpha - Angle in radiands
     */
     public setRotationsMatrixZ(alpha: number): void {
        this.parameters[0][0] = Math.cos(alpha);
        this.parameters[0][1] = -Math.sin(alpha);
        this.parameters[0][2] = 0;

        this.parameters[1][0] = Math.sin(alpha);
        this.parameters[1][1] = Math.cos(alpha);
        this.parameters[1][2] = 0;

        this.parameters[2][0] = 0;
        this.parameters[2][1] = 0;
        this.parameters[2][2] = 1;
    }

    /**
     * @param {Vector} vec - Einheitsvector of the direction
     * @param {number} alpha - Angle in radiands
     */
    public setRotationsMatrixBasedOnDirection(
        vec: Vector,
        alpha: number
    ): void {
        const cosAlpha = Math.cos(alpha);
        const sinAlpha = Math.sin(alpha);
        this.parameters[0][0] = (Math.pow(vec.x, 2) * (1 - cosAlpha)) + cosAlpha;
        this.parameters[0][1] = (vec.x * vec.y * (1 - cosAlpha)) - (vec.z * sinAlpha);
        this.parameters[0][2] = (vec.x * vec.z * (1 - cosAlpha)) + (vec.y * sinAlpha);

        this.parameters[1][0] = (vec.x * vec.y * (1 - cosAlpha)) + (vec.z * sinAlpha);
        this.parameters[1][1] = (Math.pow(vec.y, 2) * (1 - cosAlpha)) + cosAlpha;
        this.parameters[1][2] = (vec.y * vec.z * (1 - cosAlpha)) - (vec.x * sinAlpha);

        this.parameters[2][0] = (vec.x * vec.z * (1 - cosAlpha)) - (vec.y * sinAlpha);
        this.parameters[2][1] = (vec.z * vec.y * (1 - cosAlpha)) + (vec.x * sinAlpha);
        this.parameters[2][2] = (Math.pow(vec.z, 2) * (1 - cosAlpha)) + cosAlpha;
    }
  }
  