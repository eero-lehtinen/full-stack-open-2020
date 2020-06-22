let notifTimeoutHandle = null;

export const setNotification = (message, time, isError) => {
	return async dispatch => {
		dispatch({
			type: 'SET_NOTIFICATION',
			data: { message, isError }
		})
		clearTimeout(notifTimeoutHandle)
		notifTimeoutHandle = setTimeout(() => {
			dispatch({ type: 'CLEAR_NOTIFICATION' })
		}, time * 1000)
	}
}

const notificationReducer = (state = null, action) => {
	switch (action.type) {
		case 'SET_NOTIFICATION':
			return action.data
		case 'CLEAR_NOTIFICATION':
			return null
		default:
			return state
	}
}

export default notificationReducer