import React from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from "react-router-dom"
import { List, Divider } from 'antd'

const User = () => {
	const users = useSelector(state => state.users)
	const idMatch = useRouteMatch('/users/:id')
	const user = idMatch
		? users.find(user => user.id === idMatch.params.id)
		: null

	if (user) {
		return (
			<>
				<h2>{user.name}</h2>
				<Divider orientation='left'>Added blogs</Divider>
				<List bordered dataSource={user.blogs} renderItem={blog => <List.Item>{blog.title}</List.Item>} />
			</>
		)
	}
	else {
		return null
	}
}

export default User

