import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogInput from './components/BlogInput'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({})


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
      showNotification(`login success`, false)
    } catch (exception) {
      showNotification('wrong username or password', true)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const addBlog = blog => {
    setBlogs(blogs.concat(blog))
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogsForm = () => (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <BlogInput addBlog={addBlog} showNotification={showNotification} />
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </>
  )

  return (
    <div>
      {user === null ? loginForm() : blogsForm()}
    </div>
  )
}

export default App