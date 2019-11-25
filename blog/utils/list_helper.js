// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {

  return 1
}
const totalLikes = (blogPosts) =>
{
  let sum = 0
  for(let i = 0; i<blogPosts.length; i++){
    sum += blogPosts[i].likes
  }
  return sum
}
const favoriteBlog = (blogPosts) => {
  if(blogPosts.length > 0){
    const favorite =blogPosts.reduce((prior, next) => {
      if(prior.likes <= next.likes) return next
      else return prior 
    })
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }
  else{
    return 0
  }
}
const mostBlogs = (blogPosts) => {
  if(blogPosts.length > 0){
    const authors=blogPosts.map((blog) => {
      return blog.author
    })
    let counts = {}
    authors.forEach((x)=>{
      counts[x] = (counts[x] || 0)+1
    })
    const arrayCounts = Object.keys(counts)
    const mostBlogs= arrayCounts.reduce((prior, next) => {
      if(counts[prior]<= counts[next] ) return next
      else return prior
    })
    const result = {
      author : mostBlogs,
      blogs: counts[mostBlogs]
    }
    return result
  }
  return 0
}
const mostLikes = (blogPosts) => {
  if(blogPosts.length > 0){
    let counts = {}
    blogPosts.forEach((blog) => {
      counts[blog.author] = (counts[blog.author]||0)+blog.likes
    })
    const arrayCounts = Object.keys(counts)
    const mostLikes = arrayCounts.reduce((prior, next) => {
      if(counts[prior]<= counts[next]) return next
      else return prior
    })
    const result = {
      author: mostLikes,
      likes: counts[mostLikes]
    }
    return result
  }
  return 0
}
module.exports ={dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes} 