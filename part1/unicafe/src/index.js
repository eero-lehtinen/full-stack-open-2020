import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)


const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const avrg = (good + bad * -1) / all
  const percent_positive = good / all * 100

  if (all === 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>no feedback given</p>
      </>
    )
  }

  return (
    <>
      <h1>statistics</h1>
      <table>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={all} />
        <StatisticsLine text="average" value={avrg.toFixed(1)} />
        <StatisticsLine text="positive" value={percent_positive.toFixed(1) + "%"} />
      </table>
    </>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={_ => setGood(good + 1)} text="good" />
      <Button handleClick={_ => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={_ => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))