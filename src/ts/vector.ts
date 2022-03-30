export class Vector {
    static readonly TOLERANCE: number = .0000000001;
    static readonly RAD_90: number = Math.PI / 2;
    static readonly RAD_180: number = Math.PI;
    static readonly RAD_270: number = 3 * Math.PI * 2;
    static readonly RAD_360: number = Math.PI * 2;

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    sub(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    mul(n: number): Vector {
        return new Vector(this.x * n, this.y * n);
    }

    inv(): Vector {
        return this.mul(-1);
    }

    div(n: number): Vector {
        return new Vector(this.x / n, this.y / n);
    }

    abs(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    transform(origin: Vector, abscissa: Vector): Vector {
        let ordinate = abscissa.rotate(Math.PI / 2);
        return origin.add(abscissa.mul(this.x).add(ordinate.mul(this.y)));
    }

    setLength(length: number): Vector {
        const r = length / this.abs();
        return new Vector(this.x * r, this.y * r);
    }

    rotate(angleInRad: number): Vector {
        return new Vector(
            this.x * Math.cos(angleInRad) - this.y * Math.sin(angleInRad),
            this.x * Math.sin(angleInRad) + this.y * Math.cos(angleInRad)
        );
    }

    angle(): number {
        if (this.x == 0) {
            if (this.y == 0) {
                return NaN;
            } else if (this.y > 0) {
                return Vector.RAD_90;
            } else {
                return Vector.RAD_270;
            }
        } else {
            if (this.x > 0) {
                if (this.y > 0) {
                    return Math.atan(this.y / this.x);
                } else {
                    return Vector.RAD_360 + Math.atan(this.y / this.x);
                }
            } else {
                return Vector.RAD_180 + Math.atan(this.y / this.x);
            }
        }
    }

    angleTo(other: Vector, ccw: boolean): number {
        let ta = this.angle();
        let va = other.angle();
        if (ccw) {
            return ta <= va ? va - ta : (Vector.RAD_360 - ta + va);
        } else {
            return ta <= va ? -(Vector.RAD_360 - va + ta) : va - ta;
        }
    }

    equals(obj: Vector):boolean {
        return (obj instanceof Vector) && (obj.x === this.x) && (obj.y === this.y);
    }

    equalsWithTolerance(v: Vector) {
        return (this.x >= v.x - Vector.TOLERANCE)
            && (this.x <= v.x + Vector.TOLERANCE)
            && (this.y >= v.y - Vector.TOLERANCE)
            && (this.y <= v.y + Vector.TOLERANCE);
    }

    hashCode(): string {
        return `(${this.x},${this.y})`;
    }

    toString(): string {
        return this.hashCode();
    }
}
