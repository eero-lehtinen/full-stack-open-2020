import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'

const Notification = () => {
	const notification = useSelector(state => state.notification)

	return (
		(notification &&
			<Alert showIcon={true} type={notification.isError ? 'error' : 'info'} message={notification.message} />
		))
}

export default Notification