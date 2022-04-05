import * as React from 'react'
import tw from 'twin.macro'

export type TileState = 'X' | 'O' | null

interface ITileProps {
  state: TileState
  clicked: () => void
}

/**
 * The base tile for the game board.
 */
const baseTile = tw`w-12 h-12 flex justify-center items-center bg-white border-2 border-black`

/**
 * sets the text color to black.
 */
const textColor = tw`text-black`

/**
 * A tile that can be clicked on.
 * @param {ITileProps} props - The props for the tile.
 * @returns A tile that can be clicked on.
 */
export const Tile: React.FunctionComponent<ITileProps> = ({ clicked, state }) => {
  const color =
    // check eq 'X'
    state === 'X'
      ? // is eq 'X'
        tw`bg-blue-300`
      : // not eq 'X', and check eq 'O'
      state === 'O'
      ? // is eq 'O'
        tw`bg-red-300`
      : // not eq 'X' and not eq 'O'
        tw`bg-white`

  return (
    <div css={[baseTile, color]} onClick={clicked}>
      <p css={textColor}>{state ?? ''}</p>
    </div>
  )
}
