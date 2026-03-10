const { test, before, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
require('dotenv').config();
process.env.NODE_ENV = 'test';
const { connectIfNeeded } = require('../utils/config');
const Blog = require('../models/blogs');
const {
  initializeBlogs,
  blogsInDb,
  nonExistingId
} = require('./blog_test_helper');
const app = require('../app');
const assert = require('assert');
const supertest = require('supertest');

const api = supertest(app);

before(async () => {
  await connectIfNeeded();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogs = initializeBlogs();
  const promiseBlogs = blogs.map(blog => new Blog(blog).save());
  await Promise.all(promiseBlogs);
});

describe('blog_test', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('unique identifier property of blog post is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogs = response.body;
    assert.ok(blogs.length > 0, 'expected at least one blog');
    blogs.forEach(blog => {
      assert.ok(
        Object.prototype.hasOwnProperty.call(blog, 'id'),
        'blog missing `id` property'
      );
      assert.strictEqual(blog._id, undefined, '`_id` should not be exposed');
    });
  });

  test('post and count of blog are increment by one', async () => {
    const initialBlogsCount = (await blogsInDb()).length;
    const newBlog = {
      title: 'React patterns',
      author: '',
      url: 'https://reactpatterns.com/'
    };
    await api.post('/api/blogs').send(newBlog).expect(201);
    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, initialBlogsCount + 1);
  });

  test('post an blog without likes and make sure the default likes is 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: '',
      url: 'https://reactpatterns.com/'
    };
    await api.post('/api/blogs').send(newBlog).expect(201);
    const blogsAtEnd = await blogsInDb();
    const added = blogsAtEnd.find(blog => blog.title === 'React patterns');
    assert.strictEqual(added.likes, 0);
  });

  test('post an blog without title or url', async () => {
    const newBlog = {
      author: ''
    };
    await api.post('/api/blogs').send(newBlog).expect(400);
    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, initializeBlogs().length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
