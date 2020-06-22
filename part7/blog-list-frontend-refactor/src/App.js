import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogInput from './components/CreateBlogInput'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import { initializeBlogs } from './reducers/blogReducer'
import { tryLoginFromStorage, login, logout } from './reducers/loginReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
	Switch, Route, Link, useRouteMatch, useHistory
} from "react-router-dom"


const App = () => {
	const blogs = useSelector(state => state.blogs)
	const loggedUser = useSelector(state => state.loggedUser)

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

	const loggedUserElement = () => (
		<>
			<h2>Blogs</h2>
			<Notification />
			<p>{loggedUser.name} logged in <button onClick={handleLogout}>logout</button></p>
		</>
	)

	const home = () => (
		<>
			<Togglable buttonLabel='new blog' ref={createBlogInputToggleRef}>
				<BlogInput toggleRef={createBlogInputToggleRef} />
			</Togglable>
			{blogs.map(blog =>
				<Link key={blog.id} to={`/blogs/${blog.id}`} >{blog.title} by {blog.author}</Link>)}
		</>
	)

	return (
		<>
			{loggedUser === null ? loginForm() : loggedUserElement()}
			<Switch>
				<Route path='/blogs/:id'>
					<Blog />
				</Route>
				<Route path='/users/:id'>
					<User />
				</Route>
				<Route path='/users'>
					<Users />
				</Route>
				<Route path='/'>
					{loggedUser === null ? null : home()}
				</Route>
			</Switch>
		</>
	)
}

export default App