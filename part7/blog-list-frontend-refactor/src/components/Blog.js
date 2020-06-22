import React from 'react'
import { removeBlog, addLike } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import {
	useRouteMatch, useHistory
} from "react-router-dom"

const Blog = () => {

	const history = useHistory()
	const dispatch = useDispatch()

	const blogs = useSelector(state => state.blogs)
	const loggedUser = useSelector(state => state.loggedUser)

	const idMatch = useRouteMatch('/blogs/:id')
	const blog = idMatch
		? blogs.find(blog => blog.id === idMatch.params.id)
		: null

	const remove = blog => {
		let result = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
		if (result) {
			dispatch(removeBlog(blog))
			history.push('/')
		}
	}

	if (blog) {
		return (
			<>
				<h1>{blog.title} by {blog.author}</h1>
				<a href={blog.url}>{blog.url}</a>
				<div>{blog.likes} likes <button className='like' onClick={() => dispatch(addLike(blog.id))}>like</button></div>
				<div>added by {blog.user.name}</div>
				{loggedUser.username === blog.user.username && <button className='delete' onClick={() => remove(blog)}>remove</button>}
			</>
		)
	}
	else {
		return null
	}
}

export default Blog

