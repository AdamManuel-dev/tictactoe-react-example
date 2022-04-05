// Library Imports
import { pipe } from 'rambdax'
import React, { useEffect } from 'react'
import tw from 'twin.macro'
import { Tile } from '../tile'
// Local Imports
import { useBoard, useGame, useTurns } from './board.hooks'

export interface IBoardProps {
  /**
   * A function that is called when the game ends
   */
  onGameEnd?: (winner: 'O' | 'X' | 'NONE') => void
  turnChange?: (winner: 'O' | 'X') => void
}
/**
 * The board component.
 * @param {IBoardProps} props - The props for the board.
 * @returns None
 */
export function Board({
  onGameEnd = (winner) => {
    /** noop */
  },
  turnChange = (turn) => {
    /** noop */
  },
}: IBoardProps) {
  const { board, setBoardTile, checkAllWins, resetBoard } = useBoard()
  const { currentTurn, toggleTurn, resetTurn } = useTurns(turnChange)
  const { winner, setWinner, resetWinner } = useGame()

  /**
   * Resets the game state.
   * @returns None
   */
  const resetGame = pipe(resetWinner, resetTurn, resetBoard)

  useEffect(() => {
    // check win state
    const foundWinner = checkAllWins()
    if (foundWinner) {
      setWinner(foundWinner)
      onGameEnd(foundWinner)
    }
  }, [board])

  /**
   * the handler function that is called when a tile is clicked.
   * @param {number} i - the row of the tile that was clicked.
   * @param {number} j - the column of the tile that was clicked.
   * @returns None
   */
  const tileClicked = (i: number, j: number) => {
    if (board.tiles[i][j] === null) {
      setBoardTile(i, j, currentTurn)
      toggleTurn()
    }
  }

  return (
    <div css={tw`flex flex-col w-full justify-start items-center`}>
      {board.tiles.map((row, i) => {
        return (
          <div css={[tw`flex flex-row justify-between w-full`, { width: '9rem' }]} key={i}>
            {row.map((tile, j) => {
              return <Tile state={tile} clicked={() => tileClicked(i, j)} key={j}></Tile>
            })}
          </div>
        )
      })}
      <div css={tw`flex flex-row justify-between items-center`}>
        {winner && (
          <React.Fragment>
            <div css={tw`w-1/2 p-6`}>
              <button css={tw`btn btn-block`} onClick={resetGame}>
                Reset Game
              </button>
            </div>
            <span css={tw`w-full text-2xl text-center underline`}>Winner is {winner}</span>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
