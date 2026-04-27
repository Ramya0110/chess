import { useContext } from "react"
import type { PieceInfoType } from "../interfaces/piece-info"
import type { Square, Tile } from "../interfaces/tile"
import { AppContext } from "../contexts/AppContext"
import { ChessBoardContext } from "../contexts/ChessBoardContext"
import type { Cell } from "../interfaces/cell"
import type { Colour } from "../types/colour"

export const useChessTile = () => {
    const { whiteTurn, setWhiteTurn, coveredPieces, setCoveredPieces, setOpenDialog, setPromotedPiece } = useContext(AppContext)
    const {boardState, setBoardState, availableMoves, setAvailableMoves, currentMovingPiece, setCurrentMovingPiece, kingOnCheck } = useContext(ChessBoardContext);
    
    const validateAndChangeTurn = (tile: Tile | undefined) => {
        if (!tile) {
            return
        }
        if (tile.colour === "WHITE") {
            setWhiteTurn(false)
        }
        else {
            setWhiteTurn(true)
        }
    }

    const isTileEmpty = (row: number, col: number) => {
        return !boardState[row][col]
    }
    const onTileClick = (tile: Square, row: number, col: number) => {
        if (tile && ((tile?.colour === "WHITE" && whiteTurn) || (tile?.colour === "BLACK" && !whiteTurn))) {
            // piece present
            availableMoves.length = 0
            setCurrentMovingPiece({ tile, cell: { row, col } })
            const moves: Cell[] = []
            switch (true) {
                case "P" === tile.piece: {
                    if (tile.colour === "WHITE") {
                        if (row === 6) {
                            if (isTileEmpty(5, col)) {
                                moves.push({ row: 5, col })
                                if (isTileEmpty(4, col)) {
                                    moves.push({ row: 4, col })
                                }
                            }
                            if (!isTileEmpty(row - 1, col - 1) && boardState[row - 1][col - 1]?.colour === "BLACK") {
                                moves.push({ row: row - 1, col: col - 1 })
                            }
                            if (!isTileEmpty(row - 1, col + 1) && boardState[row - 1][col + 1]?.colour === "BLACK") {
                                moves.push({ row: row - 1, col: col + 1 })
                            }
                        }
                        else if (row > 0) {
                            if (isTileEmpty(row - 1, col)) {
                                moves.push({ row: row - 1, col })
                            }
                            if (!isTileEmpty(row - 1, col - 1) && boardState[row - 1][col - 1]?.colour === "BLACK") {
                                moves.push({ row: row - 1, col: col - 1 })
                            }
                            if (!isTileEmpty(row - 1, col + 1) && boardState[row - 1][col + 1]?.colour === "BLACK") {
                                moves.push({ row: row - 1, col: col + 1 })
                            }
                        }
                    }
                    else if (tile.colour === "BLACK") {
                        if (row === 1) {
                            if (isTileEmpty(2, col)) {
                                moves.push({ row: 2, col })
                                if (isTileEmpty(3, col)) {
                                    moves.push({ row: 3, col })
                                }
                            }
                            if (!isTileEmpty(row + 1, col - 1) && boardState[row + 1][col - 1]?.colour === "WHITE") {
                                moves.push({ row: row + 1, col: col - 1 })
                            }
                            if (!isTileEmpty(row + 1, col + 1) && boardState[row + 1][col + 1]?.colour === "WHITE") {
                                moves.push({ row: row + 1, col: col + 1 })
                            }
                        }
                        else if (row < 7) {
                            if (isTileEmpty(row + 1, col)) {
                                moves.push({ row: row + 1, col })
                            }
                            if (!isTileEmpty(row + 1, col - 1) && boardState[row + 1][col - 1]?.colour === "WHITE") {
                                moves.push({ row: row + 1, col: col - 1 })
                            }
                            if (!isTileEmpty(row + 1, col + 1) && boardState[row + 1][col + 1]?.colour === "WHITE") {
                                moves.push({ row: row + 1, col: col + 1 })
                            }
                        }
                    }
                    setAvailableMoves(moves)
                    return
                }
                case "R" === tile.piece || "Q" === tile.piece: {
                    // R moves till it finds tile of 
                    // 1. same colour - highlight green until row-1/col-1 
                    // 2. different colour - highlight green until row-1/col-1 and orange for the other tile
                    // 3. chess board boundary  - highlight green in current row and current col
                    let i = 1;
                    while (row + i <= 7) { //rook downward
                        const tileToPush = boardState[row + i][col]
                        if (!tileToPush || tileToPush.colour !== tile.colour) {
                            moves.push({ row: row + i, col })
                        }
                        if (tileToPush) {
                            break;
                        }
                        i++;
                    }
                    i = 1;
                    while (row - i >= 0) { //rook upward
                        const tileToPush = boardState[row - i][col]
                        if (!tileToPush || tileToPush.colour !== tile.colour) {
                            moves.push({ row: row - i, col })
                        }
                        if (tileToPush) {
                            break;
                        }
                        i++;
                    }
                    i = 1;
                    while (col + i <= 7) { //rook right
                        const tileToPush = boardState[row][col + i]
                        if (!tileToPush || tileToPush.colour !== tile.colour) {
                            moves.push({ row, col: col + i })
                        }
                        if (tileToPush) {
                            break;
                        }
                        i++;
                    }
                    i = 1;
                    while (col - i >= 0) { //rook left
                        const tileToPush = boardState[row][col - i]
                        if (!tileToPush || tileToPush.colour !== tile.colour) {
                            moves.push({ row, col: col - i })
                        }
                        if (tileToPush) {
                            break;
                        }
                        i++;
                    }
                    if (tile.piece === "R") {
                        setAvailableMoves(moves)
                        return
                    }
                }
                case ["B", "Q"].includes(tile.piece): {
                    bishopMove(row, col, tile, moves)
                    setAvailableMoves(moves)
                    return
                }
                case "H" === tile.piece: {
                    // q1
                    if (row - 2 >= 0 && col + 1 <= 7 &&
                        (!boardState[row - 2][col + 1] || boardState[row - 2][col + 1]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row - 2, col: col + 1 })
                    }
                    if (row - 1 >= 0 && col + 2 <= 7 &&
                        (!boardState[row - 1][col + 2] || boardState[row - 1][col + 2]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row - 1, col: col + 2 })
                    }
                    //q2
                    if (row - 2 >= 0 && col - 1 >= 0 &&
                        (!boardState[row - 2][col - 1] || boardState[row - 2][col - 1]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row - 2, col: col - 1 })
                    }
                    if (row - 1 >= 0 && col - 2 >= 0 &&
                        (!boardState[row - 1][col - 2] || boardState[row - 1][col - 2]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row - 1, col: col - 2 })
                    }
                    //q3
                    if (row + 2 <= 7 && col - 1 >= 0 &&
                        (!boardState[row + 2][col - 1] || boardState[row + 2][col - 1]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row + 2, col: col - 1 })
                    }
                    if (row + 1 <= 7 && col - 2 >= 0 &&
                        (!boardState[row + 1][col - 2] || boardState[row + 1][col - 2]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row + 1, col: col - 2 })
                    }
                    //q4
                    if (row + 2 <= 7 && col + 1 <= 7 &&
                        (!boardState[row + 2][col + 1] || boardState[row + 2][col + 1]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row + 2, col: col + 1 })
                    }
                    if (row + 1 <= 7 && col + 2 <= 7 &&
                        (!boardState[row + 1][col + 2] || boardState[row + 1][col + 2]?.colour != tile.colour)
                    ) {
                        moves.push({ row: row + 1, col: col + 2 })
                    }
                    setAvailableMoves(moves)
                    return
                }
                case "K" === tile.piece: {
                    kingMove(row - 1, col - 1, tile, moves)
                    kingMove(row - 1, col, tile, moves)
                    kingMove(row - 1, col + 1, tile, moves)
                    kingMove(row, col - 1, tile, moves)
                    kingMove(row, col + 1, tile, moves)
                    kingMove(row + 1, col - 1, tile, moves)
                    kingMove(row + 1, col, tile, moves)
                    kingMove(row + 1, col + 1, tile, moves)
                    setAvailableMoves(moves)
                    return
                }
            }
        }

        else {
            if (availableMoves.find((move) => move.row === row && move.col === col)) { //second click
                let crow: number = typeof (currentMovingPiece?.cell.row) === "number" ? currentMovingPiece.cell.row : -1;
                let ccol: number = typeof (currentMovingPiece?.cell.col) === "number" ? currentMovingPiece.cell.col : -1;
                if (crow >= 0 && ccol >= 0) {
                    let updatedBoard: Square[][] = [...[...boardState]]
                    updatedBoard[crow][ccol] = null
                    pushcoveringPieceToArray(tile, updatedBoard[row][col])
                    updatedBoard[row][col] = currentMovingPiece?.tile
                    // check if P is at the end of the board and do the promotion
                    if(updatedBoard[row][col]?.piece === "P" && (row == 0||row === 7))                   
                    {
                        setPromotedPiece({ 
                            cell: { col, row },
                            tile: { colour:"WHITE", piece:"Z" }
                        })
                        setOpenDialog(true)
                    }
                    validateAndChangeTurn(currentMovingPiece?.tile)
                    setBoardState(updatedBoard)
                    kingOnCheck.current = []
                    isCheck(updatedBoard, true)
                    isCheck(updatedBoard, false)
                    availableMoves.length = 0
                }
            }
        }
    }
    const pushcoveringPieceToArray = (tile: Square, coveringPiece: Square) => {
        let updatedCoveredPiece = { ...coveredPieces }
        if (currentMovingPiece?.tile.colour === "WHITE" && tile) {
            updatedCoveredPiece = {
                ...updatedCoveredPiece,
                black: [...updatedCoveredPiece.black, coveringPiece]
            }
        }
        if (currentMovingPiece?.tile.colour === "BLACK" && tile) {
            updatedCoveredPiece = {
                ...updatedCoveredPiece,
                white: [...updatedCoveredPiece.white, coveringPiece]
            }
        }
        setCoveredPieces(updatedCoveredPiece)
    }

    const isDiagonalCheck = (kingInfo: PieceInfoType, updatedBoard: Square[][]) => {
        //q2 diagonal
        let i = 1
        let row = kingInfo?.cell.row !== undefined ? kingInfo?.cell.row : -100
        let col = kingInfo?.cell.col !== undefined ? kingInfo?.cell.col : -100
        while (rowColExists(row - i, col - i)) {
            const nextTile: Square = updatedBoard[row - i][col - i];
            if (!nextTile) {
                i++;
                continue;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if ((i === 1 && nextTile.piece === "P" && nextTile.colour === "BLACK") || (nextTile.piece === "B" || nextTile.piece === "Q")) {
                        onCheck(kingInfo, nextTile, row - i, col - i)
                    }
                    break;
                }
                i++
            }
        }
        //q1 diagonal
        i = 1
        while (rowColExists(row - i, col + i)) {
            const nextTile: Square = updatedBoard[row - i][col + i];
            if (!nextTile) {
                i++;
                continue;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if ((i === 1 && nextTile.piece === "P" && nextTile.colour === "BLACK") || (nextTile.piece === "B" || nextTile.piece === "Q")) {
                        onCheck(kingInfo, nextTile, row - i, col + i)
                    }
                    break;
                }
                i++
            }
        }
        //q3 diagonal
        i = 1
        while (rowColExists(row + i, col - i)) {
            const nextTile: Square = updatedBoard[row + i][col - i];
            if (!nextTile) {
                i++;
                continue;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if ((i === 1 && nextTile.piece === "P" && nextTile.colour === "WHITE") || (nextTile.piece === "B" || nextTile.piece === "Q")) {
                        onCheck(kingInfo, nextTile, row + i, col - i)
                    }
                    break;
                }
                i++
            }
        }
        //q4 diagonal
        i = 1
        while (rowColExists(row + i, col + i)) {
            const nextTile: Square = updatedBoard[row + i][col + i];
            if (!nextTile) {
                i++;
                continue;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if ((i === 1 && nextTile.piece === "P" && nextTile.colour === "WHITE") || (nextTile.piece === "B" || nextTile.piece === "Q")) {
                        onCheck(kingInfo, nextTile, row + i, col + i)
                    }
                    break;
                }
                i++
            }
        }
    }

    const isPlusCheck = (kingInfo: PieceInfoType, updatedBoard: Square[][]) => {
        let i = 1
        let row = kingInfo?.cell.row !== undefined ? kingInfo?.cell.row : -100
        let col = kingInfo?.cell.col !== undefined ? kingInfo?.cell.col : -100
        //up
        while (rowColExists(row - i, col)) {
            const nextTile = updatedBoard[row - i][col]
            if (!nextTile) {
                i++;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if (nextTile.piece === "R" || nextTile.piece === "Q") {
                        onCheck(kingInfo, nextTile, row - i, col)
                    }
                    break;
                }
            }
        }
        //down
        i = 1
        while (rowColExists(row + i, col)) {
            const nextTile = updatedBoard[row + i][col]
            if (!nextTile) {
                i++;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if (nextTile.piece === "R" || nextTile.piece === "Q") {
                        onCheck(kingInfo, nextTile, row + i, col)
                    }
                    break;
                }
            }
        }
        //left
        i = 1
        while (rowColExists(row, col - i)) {
            const nextTile = updatedBoard[row][col - i]
            if (!nextTile) {
                i++;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if (nextTile.piece === "R" || nextTile.piece === "Q") {
                        onCheck(kingInfo, nextTile, row, col - i)
                    }
                    break;
                }
            }
        }
        //right
        i = 1
        while (rowColExists(row, col + i)) {
            const nextTile = updatedBoard[row][col + i]
            if (!nextTile) {
                i++;
            }
            else {
                if (nextTile.colour === kingInfo?.tile.colour) {
                    break;
                }
                else {
                    if (nextTile.piece === "R" || nextTile.piece === "Q") {
                        onCheck(kingInfo, nextTile, row, col + i)
                    }
                    break;
                }
            }
        }
    }

    const isHorseCheck = (kingInfo: PieceInfoType, updatedBoard: Square[][]) => {
        let krow: number = kingInfo?.cell.row !== undefined ? kingInfo?.cell.row : -100
        let kcol: number = kingInfo?.cell.col !== undefined ? kingInfo?.cell.col : -100
        //q2
        if ((rowColExists(krow - 2, kcol - 1) && updatedBoard[krow - 2][kcol - 1]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow - 2][kcol - 1]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow - 2][kcol - 1], krow - 2, kcol - 1)
        }
        if ((rowColExists(krow - 1, kcol - 2) && updatedBoard[krow - 1][kcol - 2]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow - 1][kcol - 2]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow - 1][kcol - 2], krow - 1, kcol - 2)
        }
        //q3
        if ((rowColExists(krow + 1, kcol - 2) && updatedBoard[krow + 1][kcol - 2]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow + 1][kcol - 2]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow + 1][kcol - 2], krow + 1, kcol - 2)
        }
        if ((rowColExists(krow + 2, kcol - 1) && updatedBoard[krow + 2][kcol - 1]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow + 2][kcol - 1]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow + 2][kcol - 1], krow + 2, kcol - 1)
        }
        //q4
        if ((rowColExists(krow + 1, kcol + 2) && updatedBoard[krow + 1][kcol + 2]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow + 1][kcol + 2]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow + 1][kcol + 2], krow + 1, kcol + 2)
        }
        if ((rowColExists(krow + 2, kcol + 1) && updatedBoard[krow + 2][kcol + 1]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow + 2][kcol + 1]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow + 2][kcol + 1], krow + 2, kcol + 1)
        }
        //q1
        if ((rowColExists(krow - 1, kcol + 2) && updatedBoard[krow - 1][kcol + 2]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow - 1][kcol + 2]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow - 1][kcol + 2], krow - 1, kcol + 2)
        }
        if ((rowColExists(krow - 2, kcol + 1) && updatedBoard[krow - 2][kcol + 1]?.colour !== kingInfo?.tile.colour && (updatedBoard[krow - 2][kcol + 1]?.piece === "H"))) {
            onCheck(kingInfo, updatedBoard[krow - 2][kcol + 1], krow - 2, kcol + 1)
        }
    }

    const isCheck = (updatedBoard: Square[][], isWhiteTurn: boolean) => {
        const kingInfo: PieceInfoType = getKingPieceInfo(updatedBoard, isWhiteTurn)
        isDiagonalCheck(kingInfo, updatedBoard)
        isPlusCheck(kingInfo, updatedBoard)
        isHorseCheck(kingInfo, updatedBoard)
    }
    const rowColExists = (row: (number | undefined), col: (number | undefined)) => row !== undefined && row >= 0 && row <= 7 && col !== undefined && col >= 0 && col <= 7
    const getKingPieceInfo = (updatedBoard: Square[][], isWhiteTurn: boolean): PieceInfoType => {
        let kingInfo: PieceInfoType = null;
        outerLoop: for (let rIndex = 0; rIndex < updatedBoard.length; rIndex++) {
            for (let cIndex = 0; cIndex < updatedBoard[rIndex].length; cIndex++) {
                const tile = updatedBoard[rIndex][cIndex];
                if (tile?.piece === "K" && ((tile?.colour === "WHITE" && isWhiteTurn) || (tile?.colour === "BLACK" && !isWhiteTurn))) {
                    kingInfo = {
                        cell: {
                            col: cIndex,
                            row: rIndex
                        },
                        tile: {
                            colour: tile.colour,
                            piece: tile.piece
                        }
                    };
                    break outerLoop;
                }
            }
        }
        return kingInfo
    }
    const onCheck = (kingInfo: PieceInfoType, nextTile: Square, row: number, col: number) => {
        console.log(`${kingInfo?.tile.colour === "WHITE" ? 'White' : 'Black'} king is in check on (${kingInfo?.cell.row},${kingInfo?.cell.col}) from a ${nextTile?.piece} at (${row},${col})`)
        kingOnCheck.current = [...kingOnCheck.current, kingInfo]
    }
    const kingMove = (row: number, col: number, tile: Square, moves: Cell[]) => {
        if (rowColExists(row, col) &&
            (!boardState[row][col] || boardState[row][col]?.colour !== tile?.colour)) {
            moves.push({ row, col })
        }
    }
    const bishopMove = (row: number, col: number, tile: Square, moves: Cell[]) => {
        let i = 1;
        while (col + i <= 7 && row + i <= 7) {
            if (isTileEmpty(row + i, col + i)) {
                moves.push({ row: row + i, col: col + i })
            }
            else {
                if (boardState[row + i][col + i]?.colour !== tile?.colour) {
                    moves.push({ row: row + i, col: col + i })
                }
                break;
            }
            i++
        }
        i = 1;
        while (col - i >= 0 && row + i <= 7) {
            if (isTileEmpty(row + i, col - i)) {
                moves.push({ row: row + i, col: col - i })
            }
            else {
                if (boardState[row + i][col - i]?.colour !== tile?.colour) {
                    moves.push({ row: row + i, col: col - i })
                }
                break;
            }
            i++
        }
        i = 1;
        while (col + i <= 7 && row - i >= 0) {
            if (isTileEmpty(row - i, col + i)) {
                moves.push({ row: row - i, col: col + i })
            }
            else {
                if (boardState[row - i][col + i]?.colour !== tile?.colour) {
                    moves.push({ row: row - i, col: col + i })
                }
                break;
            }
            i++
        }
        i = 1;
        while (col - i >= 0 && row - i >= 0) {
            if (isTileEmpty(row - i, col - i)) {
                moves.push({ row: row - i, col: col - i })
            }
            else {
                if (boardState[row - i][col - i]?.colour !== tile?.colour) {
                    moves.push({ row: row - i, col: col - i })
                }
                break;
            }
            i++
        }
    }
    const getTileColour = (tile: Square, rindex: number, cindex: number) => {
        let backgroundColor;
        if (availableMoves.find((move) => move.row === rindex && move.col === cindex)) {
            if (tile) {
                backgroundColor = "orange"
            }
            else {
                backgroundColor = "green"
            }
        }
        else if (kingOnCheck.current.find((piece) => piece?.cell.row === rindex && piece?.cell.col === cindex)) {
            backgroundColor = "red"
        }
        else {
            if ((rindex + cindex) % 2 == 0) {
                backgroundColor = "rgb(150, 97, 27, 50%)"
            }
            else {
                backgroundColor = "rgb(150, 97, 27)"
            }
        }
        return {
            backgroundColor
        }
    }

    const getContentStyle = (tile: Square, rindex: number, cindex: number) => {
        const isRightTurn: boolean = (tile?.colour === 'WHITE' && whiteTurn) || (tile?.colour === 'BLACK' && !whiteTurn)
        return {
            color: tile?.colour,
            cursor: !isRightTurn && getTileColour(tile, rindex, cindex)?.backgroundColor !== "orange" ?
                'not-allowed' : 'pointer'
        }
    }

    const getPieceImage = (colour: Colour, piece: string) =>{
        return `src/assets/pieces/${colour === "BLACK"?'B':'W'}${piece}.svg`
    }

    return {
        onTileClick,
        getTileColour,
        getContentStyle,
        getPieceImage
    }

}