const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")


blogsRouter.delete("/", async(request, response, next) => {
  try{
    await Blog.deleteMany({})
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})
blogsRouter.get("/", async (request, response, next) => {
  try{
    const notes = await Blog
      .find({}).populate("user", { username: 1, name: 1 })
      
    response.json(notes.map(note => note.toJSON()))
  } catch(exception) {
    next(exception)
  }
})
blogsRouter.get("/:id", async (request, response, next) => {
  try{
    const blog = await Blog.findById(request.params.id).populate("user", {username: 1, name: 1})
    if(blog){
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch(exception){
    next(exception)
  }
})
blogsRouter.delete("/:id", async(request, response, next) => {
  const token = request.token
  try{
    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const blog = await Blog.findById(request.params.id)
    if(decodedToken.id.toString()===blog.user.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
    else{
      response.status(400).json({error: "Wrong User"})
    }
  } catch(exception) {
    next(exception)
  }
})
blogsRouter.put("/:id", async (request, response, next) => {
  const blog = request.body
  try{
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true} )
    response.json(updatedBlog.toJSON())
  } catch(exception){
    next(exception)
  }
})
blogsRouter.post("/:id/comments", async (request, response, next) => {
  const comment = request.body.comment
  const token = request.token
  try{
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" })
    }
    const toUpdate = await Blog.findById(request.params.id)
    const result = await Blog.findByIdAndUpdate(request.params.id, {
      comments: toUpdate.toJSON().comments.concat(comment)
    })
    response.status(201).json(result.toJSON())
  } catch(exception){
    next(exception)
  }
})
blogsRouter.post("/", async (request, response, next) => {
  if(!request.body.likes){
    request.body.likes = 0
  }
  if(!request.body.title || !request.body.url){
    return response.status(400).end()
  }
  const body = request.body
  const token = request.token

  try {
    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" })
    }
    const user = await User.findById(body.userId)
    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      likes: body.likes,
      user: user._id,
      comments: []
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  } catch(exception){
    next(exception)
  }
})
module.exports = blogsRouter