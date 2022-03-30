import {Vector} from "./vector.js";

export class VectorArray extends Array<Vector> {

    constructor(...items: Vector[]) {
        super(...items);
    }

    add(addend: Vector): VectorArray {
        return new VectorArray(...this.map(v => v.add(addend)));
    }

    sub(subtrahend: Vector): VectorArray {
        return new VectorArray(...this.map(v => v.sub(subtrahend)));
    }

    mul(factor: number): VectorArray {
        return new VectorArray(...this.map(v => v.mul(factor)));
    }

    inv(): VectorArray {
        return new VectorArray(...this.map(v => v.inv()));
    }

    div(divisor: number): VectorArray {
        return new VectorArray(...this.map(v => v.div(divisor)));
    }

    transform(origin: Vector, abscissa: Vector): VectorArray {
        let ordinate = abscissa.rotate(Math.PI / 2);
        return new VectorArray(...this.map(v => origin.add(abscissa.mul(v.x).add(ordinate.mul(v.y)))));
    }

    rotate(angleInRad: number): VectorArray {
        return new VectorArray(...this.map(v => new Vector(
            v.x * Math.cos(angleInRad) - v.y * Math.sin(angleInRad),
            v.x * Math.sin(angleInRad) + v.y * Math.cos(angleInRad)
        )));
    }
}
