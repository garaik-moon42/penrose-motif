import {TilingPro} from "./tilingpro.js";
import {Tile} from "./tile.js";
import {TileKind} from "./tilekind.js";

function init() {
    let tiling = new TilingPro().deflate(5);
    let rhombs = tiling.getHalfTiles();
    rhombs.findRhombs();
    console.log(`# of rhombs: ${rhombs.size}`)
    for (let t of rhombs) {
        if (t.kind === TileKind.THICK_RHOMB || t.kind === TileKind.THIN_RHOMB) {
            placeTile(t);
        }
    }
}

function placeTile(t: Tile): void {
    console.log(`placing ${t}`);
    let tessDiv = document.getElementById("tessellation");
    let width = tessDiv.clientWidth;
    let height = tessDiv.clientHeight;
    let rhombDiv = createRhomb(t.kind === TileKind.THICK_RHOMB);
    let scale = 100 / t.abscissa.abs();
    let turns = t.abscissa.angle() / (Math.PI * 2);
    console.log(`  turns: ${turns}`);
    rhombDiv.style.left = `${width / 2 + (t.origin.x * scale)}px`;
    rhombDiv.style.top = `${height / 2 - (t.origin.y * scale)}px`;
    rhombDiv.style.transform = `scale(1, -1) rotate(${turns}turn) translateY(-50%)`;
    // rhombDiv.style.transform = `scale(1, -1) translateY(-50%)`;
    tessDiv.append(rhombDiv);
}

function createRhomb(thick: boolean): HTMLElement {
    let rhomb = document.createElement("div");
    rhomb.className = thick ? "rhomb thick" : "rhomb thin";
    let img = document.createElement("img");
    img.alt = "Tile pattern";
    img.src = thick ? "img/viragcsokor.png" : "img/viragfuzer.png";
    rhomb.appendChild(img);
    return rhomb;
}

(function(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
})(init);

