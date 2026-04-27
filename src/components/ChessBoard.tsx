import './ChessBoard.css';

import { useContext } from "react";
import { ChessTile } from './ChessTile';
import { ChessBoardContext } from '../contexts/ChessBoardContext';

export function ChessBoard() {
    const { boardState } = useContext(ChessBoardContext);

    return (
        <div className="chessboard">
            {
                boardState.map((row, rindex) => {
                    return row.map((tile, cindex) => {
                        return (
                            <ChessTile key={rindex + "-" + cindex} rindex={rindex} cindex={cindex} tile={tile}
                             />
                        )
                    })
                }
                )
            }
        </div>
    )
}