const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")
const Blog = require("../models/blog")
usersRouter.get("/", async (request, response, next) => {
  try{
    const users = await User
      .find({}).populate("blogs", { url: 1, title: 1, author: 1 })
    
    response.json(users.map(u => u.toJSON()))
  } catch(exception){
    next(exception)
  }
})
usersRouter.delete("/", async(request, response, next) => {
  try{
    await User.deleteMany({})
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})
usersRouter.post("/", async (request, response, next) => {
  try{
    const body = request.body
    if(body.password.length <= 3){
      response.status(400).json({error: "password too short"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()
    
    response.json(savedUser)
  } catch(exception)
  {
    next(exception)
  }
})
usersRouter.delete("/:id", async (request, response, next) => {
  try{
    const toDelete = User.findById(request.params.id)
    toDelete.blogs.forEach((blog) => {
      Blog.findByIdAndDelete(blog.id)
    })
    await User.findByIdAndDelete(request.params.id)
    response.status(400)
  } catch(exception){
    next(exception)
  }
})
usersRouter.get("/:id", async(request, response, next) => {
  try{
    const user = await User
      .findById(request.params.id).populate("blogs", { title: 1, author: 1 })
    
    if(user){
      response.json(user.toJSON())
    } else {
      response.status(404).end()
    }
  } catch(exception){
    next(exception)
  }
})

module.exports = usersRouter