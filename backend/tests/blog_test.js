const { test, before, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
require('dotenv').config();
process.env.NODE_ENV = 'test';
const { connectIfNeeded } = require('../utils/config');
const Blog = require('../models/blogs');
const { initialBlogs, blogsInDb, nonExistingId } = require('./test_helper');
const api = require('../app');
const assert = require('assert');
const supertest = require('supertest');

const api = supertest(api);

before(async () => {
  await connectIfNeeded();
});

beforeEach(async () => {
  Blog.deleteMany({});
  const promiseBlogs = initialBlogs.map(blog => new Blog(blog).save());
  await Promise.all(promiseBlogs);
});

describe.only('blog_test', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test();
});
