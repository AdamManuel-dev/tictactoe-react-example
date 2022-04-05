import { Board } from 'components'
import React, { useState } from 'react'
import PageLayout from './_layout'

const IndexPage: React.FC = () => {
  const initialTurn = 'O'

  const [currentCount, setCurrentCount] = useState<{ X: number; O: number; turn: 'X' | 'O' }>({
    O: 0,
    X: 0,
    turn: initialTurn,
  })

  const increaseScore = (winner: 'X' | 'O' | 'NONE') => {
    if (winner !== 'NONE') {
      setCurrentCount({
        ...currentCount,
        [winner]: currentCount[winner] + 1,
      })
    }
  }

  const setCurrentTurn = (turn: 'X' | 'O') => {
    setCurrentCount({
      ...currentCount,
      turn: turn,
    })
  }

  return (
    <PageLayout {...currentCount}>
      <Board onGameEnd={increaseScore} turnChange={setCurrentTurn} />
    </PageLayout>
  )
}

export default IndexPage
