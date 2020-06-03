import React from 'react'

const Notification = ({ notification }) => {
	if (notification.message === undefined) {
		return null
	}

	return (
		<div className={notification.isError ? 'error' : 'info'}>
			{notification.message}
		</div>
	)
}

export default Notification