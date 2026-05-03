import type { Colour } from "../types/colour";

export type Square = Tile | null | undefined
export interface Tile{
    piece: string;
    colour: Colour;
    untouched?: boolean;
}