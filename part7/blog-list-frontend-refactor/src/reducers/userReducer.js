import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

export const tryLoginFromStorage = () => {
	return dispatch => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			dispatch({
				type: 'LOG_IN',
				data: user
			})
			blogService.setToken(user.token)
		}
	}
}

export const login = (username, password) => {
	return async dispatch => {
		try {
			const user = await loginService.login({
				username, password,
			})

			window.localStorage.setItem(
				'loggedUser', JSON.stringify(user)
			)

			dispatch({
				type: 'LOG_IN',
				data: user
			})
			blogService.setToken(user.token)
			dispatch(setNotification('login success', 5, false))
		} catch (error) {
			dispatch(setNotification('wrong username or password', 5, true))
		}
	}
}

export const logout = () => {
	return dispatch => {
		window.localStorage.removeItem('loggedUser')
		dispatch({ type: 'LOG_OUT' })
		blogService.setToken(null)
	}
}

const userReducer = (state = { loggedUser: null }, action) => {
	switch (action.type) {
		case 'LOG_IN':
			return { ...state, loggedUser: action.data }
		case 'LOG_OUT':
			return { ...state, loggedUser: null }
		default:
			return state
	}
}

export default userReducer
