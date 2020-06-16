export const setFilter = (filter) => {
	return {
		type: 'SET_FILTER',
		data: { filter }
	}
}

const initialState = ''

const filterReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_FILTER':
			return action.data.filter
		default:
			return state
	}
}

export default filterReducer