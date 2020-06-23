import React, { useState, useImperativeHandle } from 'react'
import { Button } from 'antd'

const Togglable = (props, ref) => {
	const [visible, setVisible] = useState(false)

	const hideWhenVisible = { display: visible ? 'none' : '' }
	const showWhenVisible = { display: visible ? '' : 'none' }

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	useImperativeHandle(ref, () => {
		return {
			toggleVisibility
		}
	})

	return (
		<div className='togglable'>
			<div style={hideWhenVisible}>
				{<Button type='primary' onClick={toggleVisibility}>{props.buttonLabel}</Button>}
			</div>
			<div style={showWhenVisible}>
				{props.children}
				<Button className='close-toggle' onClick={toggleVisibility}>cancel</Button>
			</div>
		</div>
	)
}

export default React.forwardRef(Togglable)