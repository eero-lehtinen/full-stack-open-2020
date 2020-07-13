const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const MONGODB_URL = 'mongodb+srv://user:Y5Z8PiGrnbNqDQ1n@cluster0-ifcor.mongodb.net/library?retryWrites=true&w=majority'

const JWT_SECRET = 'SALA'

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message)
	})

const typeDefs = gql`
	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Book {
		title: String!
		author: Author!
		published: Int!
		genres: [String!]! 
		id: ID!
	}

	type Author {
		name: String!
		born: Int
		bookCount: Int!
		id: ID!
	}
	
  type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
		me: User
	}
	
	type Mutation {
		addBook(
			title: String!
			author: String
			published: Int!
			genres: [String!]!
		): Book

		editAuthor (
			name: String!
			setBornTo: Int!
		): Author

		createUser(
    username: String!
    favoriteGenre: String!
		): User

		login(
			username: String!
			password: String!
		): Token
	}
`

const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: (root, args) => {
			if (args.genre) {
				return Book.find({ genres: { $in: args.genre } }).populate("author")
			}

			return Book.find({}).populate("author")
		},
		allAuthors: () => {
			return Author.find({})
		},
		me: (root, args, { currentUser }) => currentUser
	},
	Author: {
		bookCount: (root) => {
			return Book.collection.countDocuments({ author: root._id })
		}
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError("not authenticated")
			}

			var author = await Author.findOne({ name: args.author })
			if (!author) {
				author = new Author({ name: args.author })
				try {
					await author.save()
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args,
					})
				}
			}

			const book = new Book({ ...args, author })

			try {
				await book.save()
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				})
			}

			return book
		},
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError("not authenticated")
			}

			const author = await Author.findOne({ name: args.name })
			if (!author)
				return null

			author.born = args.setBornTo

			try {
				await author.save()
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				})
			}

			return author
		},
		createUser: async (root, args) => {
			const user = new User({ ...args })
			try {
				await user.save()
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				})
			}
			return user
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })

			if (!user || args.password !== 'pw') {
				throw new UserInputError("wrong credentials")
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			}

			return { value: jwt.sign(userForToken, JWT_SECRET) }
		}
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null
		if (auth && auth.toLowerCase().startsWith('bearer ')) {
			const decodedToken = jwt.verify(
				auth.substring(7), JWT_SECRET
			)
			const currentUser = await User.findById(decodedToken.id)
			return { currentUser }
		}
	}
})

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`)
})