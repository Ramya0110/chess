import { useContext } from "react"
import "./CoveredPieces.css"
import { AppContext } from "../contexts/AppContext"
import { useChessTile } from "../hooks/useChessTile"
import type { Colour } from "../types/colour"
import type { Square } from "../interfaces/tile"

type ColourType = {
    colour: Colour
}

export const CoveredPieces = ({colour}: ColourType) => {
    const {coveredPieces, whiteTurn} = useContext(AppContext)
    const {getPieceImage} = useChessTile();
    
    type PieceColourType = {
        coveredPieceArray: Square[]
    }
    const PiecesContainer = ( {coveredPieceArray}: PieceColourType ) => {
        return(
            (coveredPieceArray?.length>0) && 
                <div className="pieces-container">
                    {
                        coveredPieceArray.map(square => square && <img className="covered-piece-image" src={getPieceImage(square.colour,square.piece)}></img>)                    
                    }
                </div>
        )
    }

    return(
        <div className="covered-pieces-container">
            {colour === "BLACK" &&
                <>
                    <div style={{animation:!whiteTurn?"scaleUp 0.5s infinite alternate":""}} className="profile-container" ></div>
                    <PiecesContainer coveredPieceArray={coveredPieces.white}/>
                </>
            }

            {colour === "WHITE" && 
                <>
                    <PiecesContainer coveredPieceArray={coveredPieces.black}/>
                    <div style={{backgroundColor:"white",borderColor:"black", animation:whiteTurn?"scaleUp 0.5s infinite alternate":""}} className="profile-container" ></div>
                </>
            }

        </div>
    )

}