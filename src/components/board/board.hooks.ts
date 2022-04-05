import { clone, repeat } from 'rambdax'
import { useState } from 'react'
import { TileState } from '../tile'

////////////////////////////////////////////////////////////
// Board State              ////////////////////////////////
////////////////////////////////////////////////////////////

/**
 * A 3x3 array of Game Tiles.
 * @typedef {Array<TileState>} BoardRow
 */
type BoardRow = [TileState, TileState, TileState]

/**
 * A 3x3 array of BoardRow objects that represents the board tiles.
 */
type BoardTiles = [BoardRow, BoardRow, BoardRow]

/**
 * A board object that contains the tiles of the board.
 * @property {BoardTiles} tiles - The tiles of the board.
 */
export interface BoardI {
  tiles: BoardTiles
}

/**
 * A hook that returns the current board state.
 * @returns {BoardI} - The current board state.
 */
export const useBoard = () => {
  const repeatGrid = <T>(value: T, len: number) => {
    return repeat(repeat(value, len), len)
  }

  const [board, setBoard] = useState<BoardI>({
    tiles: repeatGrid(null, 3) as BoardTiles,
  })

  const { tiles } = board

  /**
   * Sets the tile at the given coordinates to the given state.
   * @param {number} i - the row of the tile to set
   * @param {number} j - the column of the tile to set
   * @param {TileState} currentTurn - the state to set the tile to
   * @returns None
   */
  const setBoardTile = (i: number, j: number, currentTurn: TileState) => {
    const newBoard = clone(board)
    newBoard.tiles[i][j] = currentTurn
    setBoard(newBoard)
  }

  /**
   * Checks if the given tiles are all the same.
   * @param {[number, number]} [i1, j1] - the first tile to check.
   * @param {[number, number]} [i2, j2] - the second tile to check.
   * @param {[number, number]} [i3, j3] - the third tile to check.
   * @returns {boolean} - true if all the tiles are the same, false otherwise.
   */
  const checkTripleTiles = ([i1, j1]: [number, number], [i2, j2]: [number, number], [i3, j3]: [number, number]) => {
    return tiles[i1][j1] === tiles[i2][j2] && tiles[i2][j2] === tiles[i3][j3]
  }

  /**
   * Checks if there is a horizontal win.
   * @returns {string | null} - The winning tile, or null if there is no win.
   */
  const checkHorizontalWins = () => {
    if (checkTripleTiles([0, 0], [0, 1], [0, 2])) {
      return tiles[0][0]
    } else if (checkTripleTiles([1, 0], [1, 1], [1, 2])) {
      return tiles[1][0]
    } else if (checkTripleTiles([2, 0], [2, 1], [2, 2])) {
      return tiles[2][0]
    } else return null
  }

  /**
   * Checks if there is a vertical win.
   * @returns {string | null} - The winning tile, or null if there is no win.
   */
  const checkVerticalWins = () => {
    if (checkTripleTiles([0, 0], [1, 0], [2, 0])) {
      return tiles[0][0]
    } else if (checkTripleTiles([0, 1], [1, 1], [2, 1])) {
      return tiles[0][1]
    } else if (checkTripleTiles([0, 2], [1, 2], [2, 2])) {
      return tiles[0][2]
    } else return null
  }

  /**
   * Checks if there is a diagonal win.
   * @returns {string} - the winner of the game.
   */
  const checkDiagnalWins = () => {
    if (checkTripleTiles([0, 0], [1, 1], [2, 2])) {
      return tiles[0][0]
    } else if (checkTripleTiles([0, 2], [1, 1], [2, 0])) {
      return tiles[0][2]
    }
  }

  /**
   * Checks if the game is a draw.
   * @returns {string} - 'NONE' if the game is a draw, null otherwise.
   */
  const checkGameDraw = () => {
    const allTilesFilled = tiles.every((row) => row.every((tile) => tile === 'O' || tile === 'X'))
    if (allTilesFilled) return 'NONE'
    return null
  }

  /**
   * Checks if there is a winner in the game.
   * @returns {string | null} - The winner of the game, or null if there is no winner.
   */
  const checkAllWins = () => {
    console.log(`
${tiles[0][0] ?? ' '}|${tiles[0][1] ?? ' '}|${tiles[0][2] ?? ' '}
-----
${tiles[1][0] ?? ' '}|${tiles[1][1] ?? ' '}|${tiles[1][2] ?? ' '}
-----
${tiles[2][0] ?? ' '}|${tiles[2][1] ?? ' '}|${tiles[2][2] ?? ' '}
`)
    return checkHorizontalWins() ?? checkVerticalWins() ?? checkDiagnalWins() ?? checkGameDraw() ?? null
  }

  /**
   * Resets the board to its initial state.
   * @returns None
   */
  const resetBoard = () => {
    setBoard({
      tiles: repeatGrid(null, 3) as BoardTiles,
    })
  }

  return {
    board,
    setBoard,
    setBoardTile,
    checkAllWins,
    resetBoard,
  }
}

////////////////////////////////////////////////////////////
// Turn State               ////////////////////////////////
////////////////////////////////////////////////////////////

/**
 * A simple object that represents the current turn of the game.
 * @property {string} currentTurn - The current turn of the game.
 */
export interface Turn {
  currentTurn: 'X' | 'O'
}

/**
 * A hook that returns the current turn and a function to toggle the turn.
 * @param {'X' | 'O'} [firstTurn='X'] - the first turn of the game.
 * @returns {Turn} - the current turn and a function to toggle the turn.
 */
export const useTurns = (
  onChange: (turn: 'X' | 'O') => void = (turn) => {
    /** noop */
  },
  firstTurn: 'X' | 'O' = 'X'
) => {
  const initalTurn = firstTurn
  const [{ currentTurn }, setTurn] = useState<Turn>({
    currentTurn: firstTurn,
  })

  const updateTurn = (update: Turn) => {
    onChange(update.currentTurn)
    setTurn(update)
  }

  const toggleTurn = () => {
    updateTurn({
      currentTurn: currentTurn === 'X' ? 'O' : 'X',
    })
  }

  const resetTurn = () => {
    updateTurn({
      currentTurn: initalTurn,
    })
  }

  return {
    currentTurn,
    toggleTurn,
    resetTurn,
    setTurn: updateTurn,
  }
}

////////////////////////////////////////////////////////////
// Game State               ////////////////////////////////
////////////////////////////////////////////////////////////

/**
 * A game object that contains the winner of the game.
 * @property {'X' | 'O' | 'NONE' | null} winner - the winner of the game.
 */
export interface Game {
  winner: 'X' | 'O' | 'NONE' | null
}

/**
 * A hook that returns the current game state.
 * @returns {Game} - the current game state.
 */
export const useGame = () => {
  const [{ winner }, setGame] = useState<Game>({
    winner: null,
  })

  const setWinner = (winner: 'X' | 'O' | 'NONE') => {
    setGame({ winner })
  }

  const resetWinner = () => setGame({ winner: null })

  return {
    winner,
    resetWinner,
    setWinner,
  }
}

////////////////////////////////////////////////////////////
// Undo State               ////////////////////////////////
////////////////////////////////////////////////////////////

export const userUndo = () => {}
