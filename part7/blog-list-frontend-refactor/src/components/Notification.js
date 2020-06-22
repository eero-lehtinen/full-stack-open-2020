import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
	const notification = useSelector(state => state.notification)

	return (
		(notification &&
			<div className={notification.isError ? 'error' : 'info'}>
				{notification.message}
			</div>)
	)
}

export default Notification