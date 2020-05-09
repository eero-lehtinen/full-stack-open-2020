import React from 'react'
import ReactDOM from 'react-dom'


const Header = (props) => {
  return (
    <>
      <h1>{props.course.name}</h1>
    </>
  )
}


const Part = (props) => {
  return (
    <>
      <p>{props.name} {props.exersises}</p>
    </>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.course.parts[0].name} exersises={props.course.parts[0].exercises} />
      <Part name={props.course.parts[1].name} exersises={props.course.parts[1].exercises} />
      <Part name={props.course.parts[2].name} exersises={props.course.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  let amount = 0
  for (let part of props.course.parts) {
    amount += part.exercises
  }
  return (
    <>
      <p>Number of exercises {amount}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))