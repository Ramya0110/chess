import "./ChessTile.css";

import type { Square } from "../interfaces/tile";
import { useChessTile } from "../hooks/useChessTile";

export type TileProps = {
    rindex: number;
    cindex: number;
    tile: Square;
};

export const ChessTile = ({ rindex, cindex, tile }: TileProps) => {
    const {onTileClick, getTileColour, getContentStyle, getPieceImage} = useChessTile();
    
    return (
        <div key={rindex + "-" + cindex} className="tile"
            style={getTileColour(tile, rindex, cindex)}
            onClick={() => onTileClick(tile, rindex, cindex)}>
            {tile && <p className="tileContent"
                style={getContentStyle(tile, rindex, cindex)}>
                    {getPieceImage(tile.colour,tile.piece)?<img src = {getPieceImage(tile.colour,tile.piece)}></img> : tile.piece}
                    </p>
            }
        </div>
    )
}