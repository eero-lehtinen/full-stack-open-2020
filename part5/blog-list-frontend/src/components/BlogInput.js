import React, { useState } from 'react'
import blogService from '../services/blogs'

const BlogInput = ({ addBlog, showNotification }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const createBlog = async (event) => {
		event.preventDefault()
		try {
			const newBlog = await blogService.create({ title, author, url })
			clearValues()
			addBlog(newBlog)
			showNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`, false)
		}
		catch (err) {
			showNotification(err.response.data.error, true)
		}
	}

	const clearValues = () => {
		setTitle('')
		setAuthor('')
		setUrl('')
	}

	return (
		<>
			<h2>Create a new blog</h2>
			<form onSubmit={createBlog}>
				<div>
					title:
            <input
						type="text"
						value={title}
						name="Title"
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author:
            <input
						type="text"
						value={author}
						name="Author"
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					url:
            <input
						type="text"
						value={url}
						name="Url"
						onChange={({ target }) => setUrl(target.value)}
					/>
				</div>
				<button type="submit">create</button>
			</form>
		</>
	)
}


export default BlogInput 