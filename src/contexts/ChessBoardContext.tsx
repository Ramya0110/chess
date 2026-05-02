import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { PieceInfoType } from "../interfaces/piece-info";
import type { Cell } from "../interfaces/cell";
import type { SelectedPiece } from "../interfaces/selected-piece";
import type { Square } from "../interfaces/tile";
import { AppContext } from "./AppContext";

export type ChessBoardContextType = {
    kingOnCheck: React.RefObject<PieceInfoType[]>;
    availableMoves: Cell[];
    setAvailableMoves: React.Dispatch<React.SetStateAction<Cell[]>>;
    currentMovingPiece: SelectedPiece | null;
    setCurrentMovingPiece: React.Dispatch<React.SetStateAction<SelectedPiece | null>>;
    boardState: Square[][];
    setBoardState: React.Dispatch<React.SetStateAction<Square[][]>>;
}

const initialBoardState: Square[][] = [
    [{ colour: "BLACK", piece: "R", untouched: true }, { colour: "BLACK", piece: "H" }, { colour: "BLACK", piece: "B" }, { colour: "BLACK", piece: "Q" }, { colour: "BLACK", piece: "K", untouched: true }, { colour: "BLACK", piece: "B" }, { colour: "BLACK", piece: "H" }, { colour: "BLACK", piece: "R", untouched: true }],
    new Array(8).fill({ colour: "BLACK", piece: "P" }),
    new Array(8).fill(null),
    new Array(8).fill(null),
    new Array(8).fill(null),
    new Array(8).fill(null),
    new Array(8).fill({ colour: "WHITE", piece: "P" }),
    [{ colour: "WHITE", piece: "R", untouched: true }, { colour: "WHITE", piece: "H" }, { colour: "WHITE", piece: "B" }, { colour: "WHITE", piece: "Q" }, { colour: "WHITE", piece: "K", untouched: true }, { colour: "WHITE", piece: "B" }, { colour: "WHITE", piece: "H" }, { colour: "WHITE", piece: "R", untouched: true }],
]

export const ChessBoardContext = createContext<ChessBoardContextType>({
    boardState: initialBoardState,
    availableMoves: [],
    currentMovingPiece: null,
    kingOnCheck: {current: []},
    setAvailableMoves: ()=>{},
    setBoardState: ()=>{},
    setCurrentMovingPiece: ()=>{}    
})

export const ChessBoardProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
    const [boardState, setBoardState] = useState<Square[][]>(initialBoardState);
    const [availableMoves, setAvailableMoves] = useState<Cell[]>([]);
    const kingOnCheck = useRef<PieceInfoType[]>([]);
    const [currentMovingPiece, setCurrentMovingPiece] = useState<SelectedPiece | null>(null);
    const {promotedPiece, setOpenDialog} = useContext(AppContext)
    useEffect( () => {
        if(promotedPiece?.cell && promotedPiece.cell.row >= 0 && promotedPiece.cell.col >= 0 && promotedPiece.tile.piece !== "Z"){
            let updatedBoardState = [...[...boardState]]
            updatedBoardState[promotedPiece.cell.row][promotedPiece.cell.col] = {
                colour: promotedPiece.tile.colour,
                piece: promotedPiece.tile.piece
            }
            setBoardState(updatedBoardState)
            setOpenDialog(false)
        }
    },[promotedPiece])
    return(
        <ChessBoardContext.Provider value={{ availableMoves,setAvailableMoves,boardState,setBoardState,currentMovingPiece,setCurrentMovingPiece,kingOnCheck }}>
            {children}
        </ChessBoardContext.Provider>
    )
}