import { css } from '@emotion/core'
import React from 'react'
import tw from 'twin.macro'

const PageLayout: React.FC<{ X: number; O: number; turn: 'X' | 'O' }> = ({ children, ...currentCount }) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
        ${tw`flex-col w-full h-full subpixel-antialiased`}
      `}>
      <div css={tw`flex flex-col justify-center items-center p-3 w-full space-y-2 h-screen relative`}>
        <div
          css={tw`absolute top-4 right-4 w-36 p-5 rounded-xl bg-white shadow-inner border border-black flex flex-col justify-center items-start`}>
          <span css={tw`text-black text-center font-mono font-bold tracking-wide w-full`}>
            X: {currentCount.X}
            <br />
            O: {currentCount.O}
          </span>
          <span css={tw`text-black text-sm text-center font-bold w-full`}>
            Current Turn:
            <br />
            {currentCount.turn}
          </span>
        </div>
        <div
          css={tw`hidden xs:flex absolute top-4 left-4 w-36 p-5 rounded bg-gray-300 shadow-lg border border-gray-700 flex-row justify-between items-center`}>
          <span css={tw`text-black text-center text-2xl`}>TicTacToe</span>
        </div>
        {children}
      </div>
    </div>
  )
}

export default PageLayout
