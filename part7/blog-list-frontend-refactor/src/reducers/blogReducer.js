import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

export const createBlog = (title, author, url) => {
	return async dispatch => {
		const blog = { title, author, url, votes: 0 }
		try {
			const newBlog = await blogService.create(blog)
			dispatch({
				type: 'NEW_BLOG',
				data: newBlog
			})
			dispatch(setNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`, 5, false))
		}
		catch (error) {
			dispatch(setNotification(error.response.data.error, 5, true))
		}
	}
}

export const addLike = (id) => {
	return async (dispatch, getState) => {
		const state = getState()
		const blogToChange = state.blogs.find(blog => blog.id === id)
		const changedBlog = { ...blogToChange, likes: blogToChange.likes + 1 }

		try {
			const newBlog = await blogService.update(changedBlog)
			dispatch({
				type: 'UPDATE_BLOG',
				data: newBlog
			})
		}
		catch (error) {
			dispatch(setNotification(error.message, 5, true))
		}
	}
}

export const addComment = (blogId, comment) => {
	return async (dispatch, getState) => {
		const state = getState()
		const blog = state.blogs.find(blog => blog.id === blogId)
		if (blog) {
			try {
				const updatedComments = await blogService.comment(blogId, comment)
				console.log(blog)
				console.log({ ...blog, comments: updatedComments })
				dispatch({
					type: 'UPDATE_BLOG',
					data: { ...blog, comments: updatedComments }
				})
			}
			catch (error) {
				dispatch(setNotification(error.message, 5, true))
			}
		}
	}
}

export const removeBlog = (blog) => {
	return async (dispatch) => {
		try {
			await blogService.remove(blog.id)
			dispatch(setNotification(`removed blog "${blog.title}" by ${blog.author}`, 5, false))
			dispatch({
				type: 'REMOVE_BLOG',
				data: blog
			})
		}
		catch (e) {
			console.log(e)
			dispatch(setNotification(`cannot remove blog "${blog.title}" by ${blog.author}`, 5, true))
		}
	}
}


export const initializeBlogs = () => {
	return async dispatch => {
		const blogs = await blogService.getAll()
		dispatch({
			type: 'INIT_BLOGS',
			data: blogs,
		})
	}
}


const blogReducer = (state = [], action) => {
	switch (action.type) {
		case 'NEW_BLOG':
			return state.concat(action.data).sort((a, b) => b.likes - a.likes)
		case 'UPDATE_BLOG':
			return state.map(blog => blog.id === action.data.id ? action.data : blog).sort((a, b) => b.likes - a.likes)
		case 'INIT_BLOGS':
			return action.data.sort((a, b) => b.likes - a.likes)
		case 'REMOVE_BLOG':
			return state.filter(blog => blog.id !== action.data.id).sort((a, b) => b.likes - a.likes)
		default:
			return state
	}
}

export default blogReducer