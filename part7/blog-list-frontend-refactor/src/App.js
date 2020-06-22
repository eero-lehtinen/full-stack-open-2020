import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogInput from './components/CreateBlogInput'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { initializeBlogs } from './reducers/blogReducer'
import { tryLoginFromStorage, login, logout } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
	const blogs = useSelector(state => state.blogs)
	const user = useSelector(state => state.users.loggedUser)

	const dispatch = useDispatch()

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	useEffect(() => {
		dispatch(initializeBlogs())
		dispatch(tryLoginFromStorage())
	}, [dispatch])

	const createBlogInputToggleRef = React.createRef()

	const handleLogin = event => {
		event.preventDefault()
		dispatch(login(username, password))
		setUsername('')
		setPassword('')
	}

	const handleLogout = event => {
		dispatch(logout())
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