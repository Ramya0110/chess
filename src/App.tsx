
import { useContext } from 'react'
import './App.css'
import { ChessBoard } from './components/ChessBoard'
import { CoveredPieces } from './components/CoveredPieces'
import { Dialog } from './components/Dialog'
import { ChessBoardProvider } from './contexts/ChessBoardContext'
import { AppContext } from './contexts/AppContext'

function App() {
  const {openDialog} = useContext(AppContext)
  return (
    <>
    {openDialog && <Dialog></Dialog>}

    <div className='app-container'>
      <ChessBoardProvider>
        <CoveredPieces colour="BLACK"/>
        <ChessBoard/>
        <CoveredPieces colour="WHITE"/>
      </ChessBoardProvider>
    </div>
    </>
  )
}

export default App
