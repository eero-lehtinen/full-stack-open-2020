import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, remove, removable, addLike }) => {
	const [visible, setVisible] = useState(false)

	return (
		<div className='blog'>
			<div>{blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button></div>
			{visible &&
				<div>
					<div>{blog.url}</div>
					<div>likes {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
					<div>{blog.user.name}</div>
					{removable && <button onClick={() => remove(blog)}>remove</button>}
				</div>
			}
		</div>
	)
}

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	remove: PropTypes.func.isRequired,
	removable: PropTypes.bool.isRequired,
	addLike: PropTypes.func.isRequired
}

export default Blog
