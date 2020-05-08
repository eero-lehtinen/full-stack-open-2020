import React from 'react'
import ReactDOM from 'react-dom'


const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}


const Part = (props) => {
  return (
    <>
      <p>{props.name} {props.desc}</p>
    </>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.name1} desc={props.desc1} />
      <Part name={props.name2} desc={props.desc2} />
      <Part name={props.name3} desc={props.desc3} />
    </div>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.amount}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content name1={part1} desc1={exercises1} name2={part2}
        desc2={exercises2} name3={part3} desc3={exercises3} />
      <Total amount={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))