import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
	const dispatch = useDispatch()

	const addAnecdote = (event) => {
		event.preventDefault()
		const text = event.target.anecdote.value
		event.target.anecdote.value = ''
		dispatch(createAnecdote(text))
	}

	return (
		<>
			<h2>Add Anecdote</h2>
			<form onSubmit={addAnecdote}>
				<input name="anecdote" />
				<button type="submit">add</button>
			</form>
		</>
	)
}
export default AnecdoteForm