import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { removeBlog, addLike } from '../reducers/blogReducer'

const Blog = ({ blog, removable }) => {
	const dispatch = useDispatch()
	const [visible, setVisible] = useState(false)

	const remove = blog => {
		let result = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
		if (result)
			dispatch(removeBlog(blog))
	}

	return (
		<div className='blog'>
			<div>{blog.title} {blog.author} <button className='view' onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button></div>
			{visible &&
				<div>
					<div>{blog.url}</div>
					<div>likes {blog.likes} <button className='like' onClick={() => dispatch(addLike(blog.id))}>like</button></div>
					<div>{blog.user.name}</div>
					{removable && <button className='delete' onClick={() => remove(blog)}>remove</button>}
				</div>
			}
		</div>
	)
}

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	removable: PropTypes.bool.isRequired,
}

export default Blog
