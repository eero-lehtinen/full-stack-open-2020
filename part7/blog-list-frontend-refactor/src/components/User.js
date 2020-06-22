import React from 'react'
import { useSelector } from 'react-redux'
import {
	useRouteMatch, useHistory
} from "react-router-dom"

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
				<h3>added blogs</h3>
				<ul>
					{user.blogs.map(blog =>
						<li key={blog.id}>{blog.title}</li>
					)}
				</ul>
			</>
		)
	}
	else {
		return null
	}
}

export default User

