import React from 'react'

const Part = ({ name, exercises }) => (
	<p>{name} {exercises}</p>
)

const Content = ({ course }) => {
	const sum = course.parts.reduce((sum, part) => sum + part.exercises, 0)
	return (
		<>
			{course.parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
			<div><strong>total of {sum} exercises</strong></div >
		</>
	)
}

const Header = ({ text }) => (
	<h2>{text}</h2>
)

const Course = ({ course }) => {
	return (
		<>
			<Header text={course.name} />
			<Content course={course} />
		</>
	)
}

export default Course