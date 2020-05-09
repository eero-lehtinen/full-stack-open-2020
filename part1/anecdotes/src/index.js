import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setPoints] = useState(Array(6).fill(0))

  const incrementPoints = _ => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setPoints(votesCopy)
  }

  const mostVotesIndex = votes.indexOf(Math.max(...votes))

  return (
    <>
      <h1>
        Anecdote of the day
      </h1>
      <div>
        {props.anecdotes[selected]}
      </div>
      <div>
        has {votes[selected]} votes
      </div>
      <Button text="vote"
        handleClick={_ => incrementPoints()} />
      <Button text="next anecdote"
        handleClick={_ => setSelected(getRandomInt(0, props.anecdotes.length - 1))} />
      <h1>
        Anecdote with most votes
      </h1>
      <div>
        {props.anecdotes[mostVotesIndex]}
      </div>
      <div>
        has {votes[mostVotesIndex]} votes
      </div>
    </>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)