import {Tile, TilePart} from "./tile.js";
import {TileKind} from "./tilekind.js";
import {Vector} from "./vector.js";
import {Constants} from "./constants.js";
import {Tessellation} from "./tessellation.js";

export class TilingPro {
    halfTiles: Tessellation[];

    constructor() {
        this.halfTiles = [TilingPro.createZeroGeneration()];
    }

    deflate(n: number): TilingPro {
        for (let i = 0; i < n; ++i) {
            let nextGeneration = new Tessellation();
            this.halfTiles[this.getGeneration()].forEach(halfTile => {
                halfTile.deflate().forEach(ht => nextGeneration.add(ht));
            });
            this.halfTiles.push(nextGeneration);
        }
        return this;
    }

    private getGeneration(): number {
        return this.halfTiles.length - 1;
    }

    private static createZeroGeneration(): Tessellation {
        let zeroGeneration = new Tessellation();
        let origin = new Vector(0, 0);
        let abscissa = new Vector(1, 0);
        for (let i = 0; i < 5; ++i) {
            zeroGeneration.add(new Tile(TileKind.DART, TilePart.LEFT, origin, abscissa.rotate(i * 2 * Math.PI / 5)));
            zeroGeneration.add(new Tile(TileKind.DART, TilePart.RIGHT, origin, abscissa.rotate(i * 2 * Math.PI / 5)));
        }
        return zeroGeneration;
    }

    /**
     * Returns the array of generated half tiles.
     * @param {number} g Generation to get half tiles of. If omitted then returns the current generation.
     * @returns {Tile[]} Array of half tiles of given (or current) generation.
     */
    getHalfTiles(g?: number): Tessellation {
        return new Tessellation(this.halfTiles[(g || this.getGeneration())]);
    }
}
