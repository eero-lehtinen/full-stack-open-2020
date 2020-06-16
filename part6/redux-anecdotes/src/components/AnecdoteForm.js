import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
	const dispatch = useDispatch()

	const addAnecdote = (event) => {
		event.preventDefault()
		const content = event.target.anecdote.value
		event.target.anecdote.value = ''
		dispatch(createAnecdote(content))
		dispatch(setNotification(content, 5))
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