import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'

const Notification = () => {
	const notification = useSelector(store => store.notification)
	const dispatch = useDispatch()

	if (notification === null) {
		return null
	}
	else {
		setTimeout(() => { dispatch(clearNotification()) }, 5000)
	}

	const style = {
		border: 'solid',
		padding: 10,
		borderWidth: 1
	}
	return (
		<div style={style}>
			{notification}
		</div>
	)
}

export default Notification