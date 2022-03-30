import {Vector} from "./vector.js";
import {TileKind} from "./tilekind.js";
import {Constants} from "./constants.js";
import {VectorArray} from "./vectorarray.js";

export enum TilePart {
    LEFT = "L",
    RIGHT = "R",
    WHOLE = "H"
}

export class Tile {
    private static _SC: number = 0; // serial number
    /** Serial number. */
    private readonly sn: number;
    /** Kind of the tile which this is the half of. */
    readonly kind : TileKind;
    /** Which part of a tile is this? */
    readonly part : TilePart;
    /** Coordinates of the origo. */
    readonly origin: Vector;
    /** Direction vector of the abscissa pointing to the (x = 1, y = 0) point. */
    readonly abscissa: Vector;

    constructor(kind: TileKind, part: TilePart, origin: Vector, abscissa: Vector) {
        this.sn = ++Tile._SC;
        this.kind = kind;
        this.part = part;
        this.origin = origin;
        this.abscissa = abscissa;
    }

    getNormalizedPoints(): VectorArray {
        return this.kind.getNormalizedPoints(this.part).transform(this.origin, this.abscissa);
    }

    deflate(): Tile[] {
        if (this.part === TilePart.WHOLE) {
            throw "Whole tile cannot be deflated for now."; // ToDo: implement deflation of whole tiles
        }
        let derivedAbscissa = this.abscissa.div(Constants.PHI);
        let points = this.kind.getNormalizedPoints(this.part);
        let transformedPointB = points[1].transform(this.origin, this.abscissa);
        let result: Tile[] = [];

        let oppositePart = this.part === TilePart.LEFT ? TilePart.RIGHT : TilePart.LEFT;
        let rotationSign = this.part === TilePart.LEFT ? -1 : 1;
        if (this.kind === TileKind.KITE) {
            result =  [
                new Tile(TileKind.KITE, this.part, transformedPointB, derivedAbscissa.rotate(rotationSign * 3 * Math.PI / 5)),
                new Tile(TileKind.KITE, oppositePart, transformedPointB, derivedAbscissa.rotate(rotationSign * 3 * Math.PI / 5)),
                new Tile(TileKind.DART, oppositePart, this.origin, derivedAbscissa.rotate(-rotationSign * Math.PI / 5)),
            ];
        }
        else if (this.kind === TileKind.DART) {
            result = [
                new Tile(TileKind.DART, this.part, transformedPointB, derivedAbscissa.rotate(rotationSign * 4 * Math.PI / 5)),
                new Tile(TileKind.KITE, this.part, this.origin, derivedAbscissa)
            ];
        }
        else {
            throw `Deflation not supported for tile kind '${this.kind}'`;
        }
        return result;
    }

    toString(): string {
        return `{kind: ${this.kind.value}, part: ${this.part}, o: ${this.origin}, a: ${this.abscissa}, sn: ${this.sn}`;
    }
}
