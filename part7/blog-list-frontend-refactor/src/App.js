import './App.css'
import React, { useEffect } from 'react'
import Blog from './components/Blog'
import BlogInput from './components/CreateBlogInput'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import NavBar from './components/NavBar'
import LoginForm from './components/LoginForm'
import { initializeBlogs } from './reducers/blogReducer'
import { tryLoginFromStorage } from './reducers/loginReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Link } from "react-router-dom"
import { Layout, List } from 'antd'


const App = () => {
	const blogs = useSelector(state => state.blogs)
	const loggedUser = useSelector(state => state.loggedUser)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(initializeBlogs())
		dispatch(tryLoginFromStorage())
	}, [dispatch])

	const createBlogInputToggleRef = React.createRef()

	const home = () => (
		<>
			<h2>Blogs</h2>
			<Togglable buttonLabel='new blog' ref={createBlogInputToggleRef}>
				<BlogInput toggleRef={createBlogInputToggleRef} />
			</Togglable>
			<List bordered dataSource={blogs} renderItem={blog => <List.Item><Link className='blog' key={blog.id} to={`/blogs/${blog.id}`} >{blog.title} by {blog.author}</Link></List.Item>} />
		</>
	)

	return (
		<Layout className='wrapper'>
			<Layout className='main'>
				{loggedUser !== null && <NavBar />}
				<Layout.Content>
					{loggedUser === null && <LoginForm />}
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
				</Layout.Content>
				<Notification />
			</Layout>
		</Layout>
	)
}

export default App