const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const api = supertest(app)

const Blog = require("../models/blog")
const User = require("../models/user")
const userIds = {}

beforeEach(async () =>{
  await Blog.deleteMany({})
  await User.deleteMany({})
  let counter = 0
  for(let user of helper.initialUsers){
    let userObject = new User(user)
    userIds[counter] = userObject.id
    await userObject.save()
    counter += 1
  }
  helper.initialBlog[0].userId = userIds[1]
  let blogObject = new Blog(helper.initialBlog[0])
  await blogObject.save()
  helper.initialBlog[1].userId = userIds[0]
  blogObject = new Blog(helper.initialBlog[1])
  await blogObject.save()
})

describe("Is JSON", () => {
  test("blogs are returned as json", async () => {
    console.log("blog are returned as jsons")
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })
})
describe("__id is id", () => {
  test("test if id is defined", async () => {
    console.log("test if id is defined")
    const result = await api.get("/api/blogs")
    result.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})
describe("test POST", () => {
  test("a blog can be added", async () => {
    console.log("a blog can be added")
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      userId: userIds[0]
    }
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    const allBlogs = await helper.blogsInDb()
    expect(allBlogs.length).toBe(helper.initialBlog.length + 1)
    const contents = allBlogs.map((blog) => blog.author)
    expect(contents).toContain(
      "Edsger W. Dijkstra"
    )
  })
  test("if likes initialised with 0", async () => {
    console.log("if likes initialised with 0")
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      userId: userIds[0] 
    }
    await api
      .post("/api/blogs")
      .send(newBlog)
    const allBlogs = await helper.blogsInDb()
    const contents = allBlogs.map((blog) => blog.likes)
    expect(contents[allBlogs.length-1]).toBe(
      0
    )
  })
  // test("Without title and url", async () => {
  //   console.log("Without title and url")
  //   const newBlogWithoutURL = {
  //     title: "Go To Statement Considered Harmful",
  //     author: "Edsger W. Dijkstra",
  //     likes: 5,
  //     userId: userIds[1]
  //   }
  //   const newBlogWithoutTitle = {
  //     author: "Edsger W. Dijkstra",
  //     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  //     likes: 5,
  //     userId: userIds[1]
  //   }
  //   await api
  //     .post("/api/blogs")
  //     .send(newBlogWithoutTitle)
  //     .expect(400)
  //   await api
  //     .post("/api/blogs")
  //     .send(newBlogWithoutURL)
  //     .expect(400)
  // })
})
describe("User post works correctly", () => {
  test("Username is too short", async () => {
    console.log("Username is too short")
    const shortUserName = {
      username: "ab",
      name: "Arta Hellas",
      password: "12345678"
    }
    await api
      .post("/api/users")
      .send(shortUserName)
      .expect(400)
  })
  test("password is too short", async () => {
    console.log("password is too short")
    const shortPassword = {
      username: "ab",
      name: "Arta Hellas",
      password: "12345678"
    }
    await api
      .post("/api/users")
      .send(shortPassword)
      .expect(400)
  })
})
describe("get users with populated blogs",  () => {
  test("user get", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const returnedJson = await api.get("/api/users")
    console.log(returnedJson)
  })
})

afterAll(() => {
  mongoose.connection.close()
})