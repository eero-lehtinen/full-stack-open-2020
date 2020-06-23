import React from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Form, Input, Button } from 'antd'

const BlogInput = ({ toggleRef }) => {

	const dispatch = useDispatch()

	const onSubmit = async (data) => {
		dispatch(createBlog(data.title, data.author, data.url))
		if (toggleRef) toggleRef.current.toggleVisibility()
	}

	return (
		<>
			<h2>Create a new blog</h2>
			<Form onFinish={onSubmit}>
				<Form.Item
					label="Title"
					name="title"
					rules={[
						{
							required: true,
							message: 'Please input a title!',
						}
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Author"
					name="author"
					rules={[
						{
							required: true,
							message: 'Please input an author!',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Url"
					name="url"
				>
					<Input />
				</Form.Item>
				<Button type='primary' htmlType='submit'>create</Button>
			</Form>
		</>
	)
}


export default BlogInput