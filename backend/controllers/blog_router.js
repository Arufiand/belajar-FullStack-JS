'use strict';
const express = require('express');
const Blogs = require('../models/blogs');
const jwt = require('jsonwebtoken');
const blogRouter = express.Router();

blogRouter.get('/', async (request, response) => {
  const blogFetch = await Blogs.find({}).populate('users', {
    username: 1,
    name: 1,
    id: 1
  });
  response.json(blogFetch);
});

blogRouter.get('/:id', async (request, response) => {
  const Blog = await Blogs.findById(request.params.id);
  if (!Blog) {
    response.statusMessage = 'Blog not found';
    return response.status(404).json({ error: 'Blog not found' });
  }
  response.json(Blog);
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  let decodedToken;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  if (!id) {
    return response.status(400).json({ error: 'id is required' });
  }

  const blogFound = await Blogs.findById(id);
  if (!blogFound) {
    return response.status(404).json({ error: 'blog not found' });
  }

  if (blogFound.user.toString() !== decodedToken.id.toString()) {
    return response
      .status(401)
      .json({ error: 'user not authorized to delete this blog' });
  }

  await Blogs.findByIdAndDelete(id);
  response.status(204).end();
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url } = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  if (!title || !author || !url) {
    return response.status(400).json({ error: 'title, author & url required' });
  }

  const existing = await Blogs.findOne({
    $or: [{ title }, { author }]
  });

  if (existing) {
    return response
      .status(400)
      .json({ error: 'title and / or author must be unique' });
  }

  const blog = new Blogs({
    title,
    author,
    url,
    likes: request.body.likes || 0
  });

  const savedData = await blog.save();
  return response.status(201).json(savedData);
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const update = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updated = await Blogs.findByIdAndUpdate(request.params.id, update, {
    new: true,
    runValidators: true,
    context: 'query'
  });

  if (!updated) {
    response.statusMessage = 'blog not found';
    return response.status(404).json({ error: 'blog not found' });
  }

  response.json(updated);
});

module.exports = blogRouter;
