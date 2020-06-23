import React, { useEffect } from 'react'
import {
	Link
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { initializeUsers } from '../reducers/userReducer'
import { Table } from 'antd'

const Users = () => {
	const users = useSelector(state => state.users)
	const dispatch = useDispatch()

	useEffect(() => { dispatch(initializeUsers()) }, [dispatch])

	const columns = [
		{
			title: 'Name',
			dataIndex: ['id', 'username'],
			key: 'username',
			render: (data, record) => (<div key={record.id}><Link to={`/users/${record.id}`}>{record.username}</Link></div>)
		},
		{
			title: 'Blogs created',
			dataIndex: 'blogs',
			key: 'blogs',
			render: (blogs, record) => blogs.length
		}
	]

	return (
		<>
			<h2>Users</h2>
			<Table columns={columns} dataSource={users} rowKey='id' />
		</>
	)
}

export default Users