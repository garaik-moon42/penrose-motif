import {Tile, TilePart} from "./tile.js";
import {TileKind} from "./tilekind.js";
import {Vector} from "./vector.js";
import {Constants} from "./constants.js";

export class Tessellation extends Set<Tile> {

    private findTileBy(origin: Vector, abscissa: Vector, part: TilePart): Tile | null {
        for (let t of this) {
            if (origin.equalsWithTolerance(t.origin)
                && abscissa.equalsWithTolerance(t.abscissa)
                && part === t.part) {
                return t;
            }

        }
        return null;
    }

    private findTilesBy(origin: Vector, abscissa?: Vector, part?: TilePart): Tile[] {
        let tiles: Tile[] = [];
        for (let t of this) {
            if (origin.equalsWithTolerance(t.origin)
                && (abscissa === undefined || abscissa.equalsWithTolerance(t.abscissa))
                && (part === undefined || part === t.part)) {
                tiles.push(t);
            }
        }
        return tiles;
    }

    private findThickRhombs() {
        this.forEach(t => {
            if (t.kind === TileKind.DART && t.part === TilePart.LEFT) {
                let rightDart = this.findTileBy(t.origin, t.abscissa, TilePart.RIGHT);
                let kiteOrigin = t.origin.add(t.abscissa.mul(1 + Constants.PHI));
                let leftKiteAbscissa = t.abscissa.rotate(4 * Math.PI / 5);
                let rightKiteAbscissa = t.abscissa.rotate(6 * Math.PI / 5);
                let leftKite = this.findTileBy(kiteOrigin, leftKiteAbscissa, TilePart.LEFT);
                let rightKite = this.findTileBy(kiteOrigin, rightKiteAbscissa, TilePart.RIGHT);
                if (rightDart !== null && leftKite !== null && rightKite !== null) {
                    this.delete(t);
                    this.delete(rightDart);
                    this.delete(leftKite);
                    this.delete(rightKite);
                    this.add(new Tile(TileKind.THICK_RHOMB, TilePart.WHOLE, t.origin, t.abscissa));
                }
            }
        })
    }

    private findThinRhombs() {
        this.forEach(t => {
            if (t.kind === TileKind.KITE && t.part === TilePart.LEFT) {
                let rightOrigin = t.origin.add(t.abscissa.mul(Constants.PHI)).add(t.abscissa.rotate(Math.PI / 5).mul(Constants.PHI));
                let rightAbscissa = t.abscissa.rotate(6 * Math.PI / 5);
                let rightHalfKite = this.findTileBy(rightOrigin, rightAbscissa, TilePart.RIGHT);
                if (rightHalfKite !== null) {
                    this.delete(t);
                    this.delete(rightHalfKite);
                    this.add(new Tile(
                        TileKind.THIN_RHOMB,
                        TilePart.WHOLE,
                        t.origin.add(t.abscissa.mul(Constants.PHI)),
                        t.abscissa.rotate(3 * Math.PI / 5)
                    ));
                }
            }
        })
    }

    findRhombs() {
        this.findThickRhombs();
        this.findThinRhombs();
    }

    private findWholesByHalves(kind: TileKind) {
        this.forEach(t => {
            if (t.kind === kind && t.part === TilePart.LEFT) {
                let rightHalfDart = this.findTileBy(t.origin, t.abscissa, TilePart.RIGHT);
                if (rightHalfDart !== null) {
                    this.delete(t);
                    this.delete(rightHalfDart);
                    this.add(new Tile(kind, TilePart.WHOLE, t.origin, t.abscissa));
                }
            }
        });
    }

    findKitesAndDarts() {
        this.findWholesByHalves(TileKind.KITE);
        this.findWholesByHalves(TileKind.DART);
    }
}