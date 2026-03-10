const Blog = require('../models/blogs');

const initializeBlogs = () => [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'SimplyFund',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  },
  {
    title: 'React patterns',
    author: 'FundedSepecially',
    url: 'https://reactpatterns.com/',
    likes: 7
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = { initializeBlogs, nonExistingId, blogsInDb };
