import {Vector} from "./vector.js";
import {Constants} from "./constants.js";
import {VectorArray} from "./vectorarray.js";
import {TilePart} from "./tile.js";

export class TileKind {
    private static origin = new Vector(0, 0);
    private static onePlusPhiPer2: number = (1 + Constants.PHI) / 2;
    private static phiSinPiOver5 = Constants.PHI * Math.sin(Math.PI / 5);
    private static phiSin2PiOver5 = Constants.PHI * Math.sin(2 * Math.PI / 5);

    static KITE = new TileKind("K", new VectorArray(
        TileKind.origin,
        new Vector(TileKind.onePlusPhiPer2, TileKind.phiSinPiOver5),
        new Vector(Constants.PHI, 0),
        new Vector(TileKind.onePlusPhiPer2, -TileKind.phiSinPiOver5),
    ));

    static DART = new TileKind("D", new VectorArray(
        TileKind.origin,
        new Vector(TileKind.onePlusPhiPer2, TileKind.phiSinPiOver5),
        new Vector(1, 0),
        new Vector(TileKind.onePlusPhiPer2, -TileKind.phiSinPiOver5)
    ));

    static THICK_RHOMB = new TileKind("t", new VectorArray(
        TileKind.origin,
        new Vector(TileKind.onePlusPhiPer2, TileKind.phiSinPiOver5),
        new Vector(1 + Constants.PHI, 0),
        new Vector(TileKind.onePlusPhiPer2, -TileKind.phiSinPiOver5)
    ));

    static THIN_RHOMB = new TileKind("T", new VectorArray(
        TileKind.origin,
        new Vector(.5, TileKind.phiSin2PiOver5),
        new Vector(1, 0),
        new Vector(.5, -TileKind.phiSin2PiOver5)
    ));

    value: String;
    private readonly _normalizedPoints: VectorArray;

    private constructor(value: String, normalizedPoints: VectorArray) {
        this.value = value;
        this._normalizedPoints = normalizedPoints;
    }

    getNormalizedPoints(part: TilePart): VectorArray {
        switch (part) {
            case TilePart.LEFT:
                return new VectorArray(
                    this._normalizedPoints[0], this._normalizedPoints[1], this._normalizedPoints[2]
                );
            case TilePart.RIGHT:
                return new VectorArray(
                    this._normalizedPoints[0], this._normalizedPoints[3], this._normalizedPoints[2]
                );
            case TilePart.WHOLE:
                return new VectorArray(...this._normalizedPoints);
        }
    }
}
