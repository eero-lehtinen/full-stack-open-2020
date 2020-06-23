import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { Form, Input, Button } from 'antd'

const LoginForm = () => {
	const dispatch = useDispatch()

	const handleLogin = data => {
		dispatch(login(data.username, data.password))
	}

	return (
		<>
			<h2>Log in</h2>
			<Form onFinish={handleLogin}>
				<Form.Item
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: 'Please input your username!',
						}
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Button type='primary' htmlType='submit'>login</Button>
			</Form>
		</>
	)
}

export default LoginForm