import { useContext } from "react"
import "./Dialog.css"
import { AppContext } from "../contexts/AppContext"
import { useChessTile } from "../hooks/useChessTile"

export const Dialog = () =>{
    const {whiteTurn, promotedPiece, setPromotedPiece} = useContext(AppContext) 
    const {getPieceImage} = useChessTile();
    const onClick = (piece: string) => {
        const cell = promotedPiece?.cell? promotedPiece.cell : { col: -1, row: -1 }
        setPromotedPiece({
            cell,
            tile: {
                colour: !whiteTurn?"WHITE":"BLACK",
                piece
            }
        })
    }

    
    return(
        <>
        <div className="dialog-container">
            <img src={getPieceImage(!whiteTurn?"WHITE":"BLACK","Q")} onClick={() => onClick("Q")}></img>
            <img src={getPieceImage(!whiteTurn?"WHITE":"BLACK","R")} onClick={() => onClick("R")}></img>
            <img src={getPieceImage(!whiteTurn?"WHITE":"BLACK","H")} onClick={() => onClick("H")}></img>
            <img src={getPieceImage(!whiteTurn?"WHITE":"BLACK","B")} onClick={() => onClick("B")}></img>            
        </div>
        <div className="dialog-overlay">

        </div>
        </>
    )
}