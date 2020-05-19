// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0)
		return undefined
	return blogs.reduce((mostLikesBlog, blog) => (mostLikesBlog.likes > blog.likes) ? mostLikesBlog : blog)
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0)
		return undefined

	let blogAuthorCounts = {}

	for (let blog of blogs) {
		if (!(blog.author in blogAuthorCounts)) {
			blogAuthorCounts[blog.author] = 0
		}
		blogAuthorCounts[blog.author]++
	}

	let largestAuthor = { author: undefined, blogs: Number.NEGATIVE_INFINITY }

	for (let blogAuthor in blogAuthorCounts) {
		if (blogAuthorCounts[blogAuthor] > largestAuthor.blogs) {
			largestAuthor = { author: blogAuthor, blogs: blogAuthorCounts[blogAuthor] }
		}
	}
	return largestAuthor
}

const mostLikes = (blogs) => {
	if (blogs.length === 0)
		return undefined

	let blogLikesCounts = {}

	for (let blog of blogs) {
		if (!(blog.author in blogLikesCounts)) {
			blogLikesCounts[blog.author] = 0
		}
		blogLikesCounts[blog.author] += blog.likes
	}

	let mostLikedAuthor = { author: undefined, likes: Number.NEGATIVE_INFINITY }

	for (let blogAuthor in blogLikesCounts) {
		if (blogLikesCounts[blogAuthor] > mostLikedAuthor.likes) {
			mostLikedAuthor = { author: blogAuthor, likes: blogLikesCounts[blogAuthor] }
		}
	}

	return mostLikedAuthor
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}