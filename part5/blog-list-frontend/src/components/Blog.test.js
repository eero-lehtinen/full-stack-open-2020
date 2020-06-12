import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
	title: '-TITLE-',
	author: '-AUTHOR-',
	url: '-URL-',
	likes: 100,
	user: {
		username: '-USERNAME-',
		name: '-NAME-',
	}
}

test('renders title and author by default', () => {
	const component = render(
		<Blog blog={blog} remove={jest.fn()} removable={false} addLike={jest.fn()} />
	)

	expect(component.container).toHaveTextContent('-TITLE- -AUTHOR-')
	expect(component.container).not.toHaveTextContent('-URL-')
	expect(component.container).not.toHaveTextContent('likes 100')
})

test('renders everything after "view" button is clicked', () => {
	const component = render(
		<Blog blog={blog} remove={jest.fn()} removable={false} addLike={jest.fn()} />
	)

	fireEvent.click(component.getByText('view'))

	expect(component.container).toHaveTextContent('-TITLE- -AUTHOR-')
	expect(component.container).toHaveTextContent('-URL-')
	expect(component.container).toHaveTextContent('likes 100')
	expect(component.container).toHaveTextContent('-NAME-')
})

test('like events are fired correctly', () => {
	const addLike = jest.fn()

	const component = render(
		<Blog blog={blog} remove={jest.fn()} removable={false} addLike={addLike} />
	)
	fireEvent.click(component.getByText('view'))

	const eventCount = 2
	const likeButton = component.getByText('like')

	for (let i = 0; i < eventCount; i++)
		fireEvent.click(likeButton)

	expect(addLike.mock.calls).toHaveLength(eventCount)
})