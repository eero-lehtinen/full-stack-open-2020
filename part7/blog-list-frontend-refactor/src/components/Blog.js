import React from 'react'
import { removeBlog, addLike, addComment } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import {
	useRouteMatch, useHistory
} from "react-router-dom"
import { useField } from '../hooks'
import { Button, Input, List } from 'antd'


const Blog = () => {
	const history = useHistory()
	const dispatch = useDispatch()
	const commentField = useField('text')

	const blogs = useSelector(state => state.blogs)
	const loggedUser = useSelector(state => state.loggedUser)

	const idMatch = useRouteMatch('/blogs/:id')
	const blog = idMatch
		? blogs.find(blog => blog.id === idMatch.params.id)
		: null

	const remove = () => {
		let result = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
		if (result) {
			dispatch(removeBlog(blog))
			history.push('/')
		}
	}

	const comment = () => {
		commentField.reset()
		dispatch(addComment(blog.id, commentField.value))
	}

	if (blog) {
		return (
			<>
				<h2>{blog.title} by {blog.author}</h2>
				<a href={blog.url}>{blog.url}</a>
				<div>{blog.likes} likes <Button className='like' onClick={() => dispatch(addLike(blog.id))}>like</Button></div>
				<div>added by {blog.user.name}</div>
				{loggedUser.username === blog.user.username && <Button className='delete' onClick={() => remove(blog)}>remove</Button>}
				<h3>comments</h3>
				<Input className='comment' type="text" {...commentField.inputProps}></Input><Button onClick={comment}>add comment</Button>
				<List size='small' bordered dataSource={blog.comments} renderItem={comment => <List.Item>{comment}</List.Item>} />
			</>
		)
	}
	else {
		return null
	}
}

export default Blog

