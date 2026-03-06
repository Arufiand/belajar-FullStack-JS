const _ = require('lodash');
const totalLikes = listWithOneBlog => {
  const totalLikes =
    listWithOneBlog.length === 0 ? 0 : listWithOneBlog[0].likes;

  return totalLikes;
};

const favoriteBlog = blogs => {
  // If no blogs, return null
  if (!blogs || blogs.length === 0) return null;

  // Use reduce to find the blog with the maximum likes
  const favorite = blogs.reduce((max, blog) => {
    if (!max || (blog.likes || 0) > (max.likes || 0)) return blog;
    return max;
  }, null);

  return favorite;
};

const mostBlogs = blogs => {
  if (!blogs || blogs.length === 0) return null;

  const counts = _.countBy(blogs, blog => blog.author);

  const authors = Object.keys(counts).map(author => ({
    author,
    blogs: counts[author]
  }));

  const top = _.maxBy(authors, author => author.blogs);

  return top || null;
};
// update in `backend/helper/list_helper.js`
const mostLikedBlog = blogs => {
  if (!blogs || blogs.length === 0) return null;

  const likesByAuthor = _(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      likes: _.sumBy(authorBlogs, 'likes') || 0
    }))
    .value();

  const top = _.maxBy(likesByAuthor, 'likes');

  return top || null;
};

module.exports = { mostBlogs, totalLikes, favoriteBlog, mostLikedBlog };
