import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogInput from './components/CreateBlogInput'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notification, setNotification] = useState({})

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs.sort((a, b) => b.likes - a.likes))
		)
	}, [])

	const createBlogInputRef = React.createRef()

	const showNotification = (message, isError) => {
		setNotification({ message: message, isError: isError })
		setTimeout(() => {
			setNotification({})
		}, 5000)
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		try {
			const user = await loginService.login({
				username, password,
			})

			window.localStorage.setItem(
				'loggedUser', JSON.stringify(user)
			)

			setUser(user)
			setUsername('')
			setPassword('')
			showNotification('login success', false)
		} catch (exception) {
			showNotification('wrong username or password', true)
		}
	}

	const handleLogout = event => {
		event.preventDefault()
		window.localStorage.removeItem('loggedUser')
		setUser(null)
	}

	const createBlog = async (title, author, url) => {
		try {
			const newBlog = await blogService.create({ title, author, url })
			createBlogInputRef.current.toggleVisibility()
			setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))
			showNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`, false)
			return true
		}
		catch (error) {
			showNotification(error.response.data.error, true)
			return false
		}
	}

	const addLike = async blog => {
		try {
			const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })
			setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
		}
		catch (error) {
			showNotification(error.message, true)
		}
	}

	const remove = async blog => {
		let result = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
		if (result) {
			try {
				const deletedBlogCopy = JSON.parse(JSON.stringify(blog))
				await blogService.remove(blog)
				setBlogs(blogs.filter(blog => blog.id !== deletedBlogCopy.id).sort((a, b) => b.likes - a.likes))
				showNotification(`removed blog "${deletedBlogCopy.title}" by ${deletedBlogCopy.author}`, false)
			}
			catch (e) {
				showNotification(`cannot remove blog "${blog.title}" by ${blog.author}`, true)
			}
		}
	}

	const loginForm = () => (
		<>
			<h2>Log in</h2>
			<Notification notification={notification} />
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text" value={username} name="Username"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type="password" value={password} name="Password"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</>
	)

	const blogsForm = () => (
		<>
			<h2>Blogs</h2>
			<Notification notification={notification} />
			<p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
			<Togglable buttonLabel='new blog' ref={createBlogInputRef}>
				<BlogInput createBlog={createBlog} />
			</Togglable>
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog}
					removable={user.username === blog.user.username}
					remove={remove}
					addLike={addLike}
				/>
			)}
		</>
	)

	return (
		<div>
			{user === null ? loginForm() : blogsForm()}
		</div>
	)
}

export default App