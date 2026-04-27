import type { Cell } from "./cell";
import type { Tile } from "./tile";

export type PieceInfoType = PieceInfo | null
export interface PieceInfo{
    cell: Cell;
    tile: Tile;
}