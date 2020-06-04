import React, { useState } from 'react'

const BlogInput = ({ createBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const clearValues = () => {
		setTitle('')
		setAuthor('')
		setUrl('')
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		const success = await createBlog(title, author, url)

		if (success)
			clearValues()
	}

	return (
		<>
			<h2>Create a new blog</h2>
			<form onSubmit={onSubmit}>
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