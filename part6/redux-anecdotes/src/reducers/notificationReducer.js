export const setNotification = (text) => {
	return {
		type: 'SET_NOTIFICATION',
		data: { text }
	}
}

export const clearNotification = () => {
	return {
		type: 'CLEAR_NOTIFICATION'
	}
}

const initialState = 'initial notification'

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_NOTIFICATION':
			return action.data.text
		case 'CLEAR_NOTIFICATION':
			return null
		default:
			return state
	}
}

export default reducer