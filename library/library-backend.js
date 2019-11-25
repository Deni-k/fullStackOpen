const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()

mongoose.set('useFindAndModify', false)
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'
const MONGODB_URI = ''

console.log('commecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Author {
    name: String
    id: ID!
    born: Int
    bookCount: Int
  }
  type User {
    username: String!
    password: String!
    favoriteGenre: String!
    id: ID!
  }

  type Subscription {
    bookAdded: Book!
  }
  
  type Token {
    recommended: String!
    value: String!
  }
  
  type Query {
    me: User
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
  }
  type Mutation {
    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    hello: () => { return "world" },
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({})
      const author = await Author.findOne({name: args.author})
      if(!args.author&&!args.genre){
        return books
      }
      if(args.author&&args.genre){
        return books.filter((book) => book.author.toString() === author._id.toString()).filter((book) => book.genres.filter((genre)=> genre === args.genre).length > 0)
      }
      if(args.author){
        return books.filter((book) => book.author.toString() === author._id.toString())
      }
      if(args.genre){
        return books.filter((book) => book.genres.filter((genre)=> genre === args.genre).length > 0)
      }
    },
    allAuthors: async () => {
      const books = await Book.find({})
      const authors = await Author.find({})
      return authors.map((author)=> {
        return {name: author.name, born: author.born , bookCount: books.filter((book)=> book.author.toString() === author._id.toString()).length}
      })
    }
  },
  Book: {
    author: ({author}) => Author.findById(author)
  },
  Mutation: {
    addBook: async (root, args, {currentUser}) => { 
      let authorFound = await Author.findOne({name: args.author})
      if(!currentUser){
        throw new AuthenticationError("not authenticated")
      }
      if(!authorFound){
        const author = new Author({name: args.author, bookCount: 1, born: null})
        authorFound = author;
        try {
          await author.save()
        } catch (error){
          throw new UserInputError(error.message, {
            invalidArgs
          })
        }
      }
      const book = new Book({...args, author:authorFound.id}) 
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      pubsub.publish('BOOK_ADDED', {bookAdded: book})
      return book
    },
    editAuthor: async (root, args, {currentUser}) => {
      console.log(currentUser)
      if(!currentUser){
        throw new AuthenticationError("not authenticated")
      }
      const author = await Author.findOne({name:args.name})
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    createUser: (root, args) => {
      const user = new User ({ username: args.username, password: args.password, favoriteGenre: args.favoriteGenre})
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message,
            {
              invalidArgs: args
            })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})
      if(!user || args.password !== user.password){
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { recommended: user.favoriteGenre , value: jwt.sign(userForToken, JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
    Author: {
      bookCount:  async(root) => {
        return (await bookCounter)[root.name] || 0
      }
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req})=>{
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer')){
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return {currentUser}
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// /*
//  * It would be more sensible to assosiate book and the author by saving 
//  * the author id instead of the name to the book.
//  * For simplicity we however save the author name.
// */

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: '5dc172311c9d440000421139',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: '5dc172311c9d440000421139',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: '5dc1724d1c9d44000042113b',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: '5dc172961c9d44000042113f',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: '5dc172ad1c9d440000421141',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: '5dc1726b1c9d44000042113d',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon',
//     published: 1872,
//     author: '5dc1726b1c9d44000042113d',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]