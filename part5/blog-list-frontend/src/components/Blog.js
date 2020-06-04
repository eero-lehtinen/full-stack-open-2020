import React, { useState } from 'react'

const Blog = ({ blog, showNotification, remove, removable, addLike }) => {
	const [visible, setVisible] = useState(false)

	return (
		<div className='blog'>
			<div>{blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button></div>
			{visible &&
				<div>
					<div>{blog.url}</div>
					<div>likes {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
					<div>{blog.author}</div>
					{removable && <button onClick={() => remove(blog)}>remove</button>}
				</div>
			}
		</div>
	)
}

export default Blog
