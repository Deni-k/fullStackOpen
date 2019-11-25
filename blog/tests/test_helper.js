const Blog = require("../models/blog")

const initialBlog = [
  {
    url: "https://overreacted.io/things-i-dont-know-as-of-2018/",
    title: "Things I don't Know As of 2018",
    author: "Dan Abramov",
    likes: 0,
    userId: ""
  },
  {
    url: "https://martinfowler.com/articles/distributed-objects-microservices.html",
    title: "Microservices and the First Law of Distributed Objects",
    author: "Martin Fowler",
    likes:0,
    userId: ""
  }
]
const initialUsers = [
  {
    username: "hellas",
    name: "Arto Hellas",
    password: "12345678"
  },
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "12345678"
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate("users")
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlog, initialUsers, nonExistingId, blogsInDb
}