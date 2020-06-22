import React, { useEffect } from 'react'
import {
	Link
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'

const Users = () => {
	const users = useSelector(state => state.users)
	const dispatch = useDispatch()

	useEffect(() => { dispatch(initializeUsers()) }, [])

	return (
		<>
			<h2>Users</h2>
			<table>
				<thead>
					<tr>
						<td></td><td><b>blogs created</b></td>
					</tr>
				</thead>
				<tbody>
					{users.map(user =>
						<tr key={user.id}>
							<td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
							<td>{user.blogs.length}</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	)
}

export default Users