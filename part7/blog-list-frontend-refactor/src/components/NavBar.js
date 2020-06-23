import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from "react-router-dom"
import { logout } from '../reducers/loginReducer'
import { Menu, Button } from 'antd'

const NavBar = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const loggedUser = useSelector(state => state.loggedUser)

	return (
		<Menu mode='horizontal' defaultSelectedKeys={[location.pathname]}>
			<Menu.Item key='/'>
				<Link to='/'> blogs</Link>
			</Menu.Item>
			<Menu.Item key='/users'>
				<Link to='/users'>users</Link>
			</Menu.Item>
			<span>{loggedUser.name} logged in <Button shape='round' onClick={() => dispatch(logout())}>logout</Button></span>
		</Menu>
	)
}

export default NavBar