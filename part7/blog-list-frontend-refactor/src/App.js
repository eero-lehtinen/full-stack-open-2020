import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogInput from './components/CreateBlogInput'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
	const blogs = useSelector(state => state.blogs)
	const dispatch = useDispatch()

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	useEffect(() => {
		dispatch(initializeBlogs())
	}, [dispatch])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	console.log("blogs", blogs)

	const createBlogInputToggleRef = React.createRef()

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
			dispatch(setNotification('login success', 5, false))
		} catch (exception) {
			dispatch(setNotification('wrong username or password', 5, true))
		}
	}

	const handleLogout = event => {
		event.preventDefault()
		window.localStorage.removeItem('loggedUser')
		setUser(null)
	}

	const loginForm = () => (
		<>
			<h2>Log in</h2>
			<Notification />
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
			<Notification />
			<p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
			<Togglable buttonLabel='new blog' ref={createBlogInputToggleRef}>
				<BlogInput toggleRef={createBlogInputToggleRef} />
			</Togglable>
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} removable={user.username === blog.user.username} />
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