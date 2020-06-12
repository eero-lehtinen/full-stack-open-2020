import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlogInput from './CreateBlogInput'

const targetBlog = {
	title: '-TITLE-',
	author: '-AUTHOR-',
	url: '-URL-',
}

test('calls createBlog function with correct arguments', () => {

	const createBlog = jest.fn()

	const component = render(
		<CreateBlogInput createBlog={createBlog} />
	)

	fireEvent.change(component.container.querySelector('input[name=Title]'), {
		target: { value: targetBlog.title }
	})
	fireEvent.change(component.container.querySelector('input[name=Author]'), {
		target: { value: targetBlog.author }
	})
	fireEvent.change(component.container.querySelector('input[name=Url]'), {
		target: { value: targetBlog.url }
	})
	fireEvent.submit(component.container.querySelector('form'))

	expect(createBlog.mock.calls).toHaveLength(1)
	expect(createBlog.mock.calls[0][0]).toBe(targetBlog.title)
	expect(createBlog.mock.calls[0][1]).toBe(targetBlog.author)
	expect(createBlog.mock.calls[0][2]).toBe(targetBlog.url)
})