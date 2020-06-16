import anecdoteService from '../services/anecdotes'

export const createAnecdote = (content) => {
	return async dispatch => {
		const anecdote = { content, votes: 0 }
		const newAnecdote = await anecdoteService.createNew(anecdote)
		dispatch({
			type: 'NEW_ANECDOTE',
			data: newAnecdote
		})
	}
}

export const addVote = (id) => {
	return async (dispatch, getState) => {
		const state = getState()
		const anecdoteToChange = state.anecdotes.find(anecdote => anecdote.id === id)
		const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
		const newAnecdote = await anecdoteService.update(changedAnecdote)
		dispatch({
			type: 'UPDATE_ANECDOTE',
			data: newAnecdote
		})
	}
}

export const initializeAnecdotes = () => {
	return async dispatch => {
		const anecdotes = await anecdoteService.getAll()
		dispatch({
			type: 'INIT_ANECDOTES',
			data: anecdotes,
		})
	}
}


const anecdoteReducer = (state = [], action) => {
	console.log('state now: ', state)
	console.log('action', action)

	switch (action.type) {
		case 'NEW_ANECDOTE':
			return state.concat(action.data)
		case 'UPDATE_ANECDOTE':
			return state.map(anecdote => anecdote.id === action.data.id ? action.data : anecdote)
		case 'INIT_ANECDOTES':
			return action.data
		default:
			return state
	}
}

export default anecdoteReducer