import { createContext, useState } from "react";
import type { CoveredPieces } from "../interfaces/covered-pieces";
import type { Square } from "../interfaces/tile";
import type { PieceInfoType } from "../interfaces/piece-info";

type AppContextType = {
    coveredPieces: CoveredPieces,
    setCoveredPieces: React.Dispatch<React.SetStateAction<CoveredPieces>>,
    whiteTurn: boolean,
    setWhiteTurn: React.Dispatch<React.SetStateAction<boolean>>,
    openDialog: boolean,
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
    promotedPiece: PieceInfoType,
    setPromotedPiece: React.Dispatch<React.SetStateAction<PieceInfoType>>
}

const initialCoveredPieces: CoveredPieces = {
    white: [],
    black: []
}

export const AppContext = createContext<AppContextType>(
    {
        coveredPieces: initialCoveredPieces,
        setCoveredPieces: ()=>{},
        whiteTurn: true,
        setWhiteTurn: ()=>{},
        openDialog: false,
        setOpenDialog: ()=>{},
        promotedPiece: null,
        setPromotedPiece: ()=>{}
    }
)

export const AppContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [coveredPieces, setCoveredPieces] = useState<CoveredPieces>(initialCoveredPieces)
    const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState(false)
    const [promotedPiece, setPromotedPiece] = useState<PieceInfoType>(null)
    
    return(
        <AppContext.Provider value={{coveredPieces, setCoveredPieces, whiteTurn, setWhiteTurn, openDialog, setOpenDialog, promotedPiece, setPromotedPiece}}>
            {children}
        </AppContext.Provider>
    )
}