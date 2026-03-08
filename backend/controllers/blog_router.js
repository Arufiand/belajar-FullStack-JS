'use strict';
const express = require('express');
const Blogs = require('../models/blogs');
const blogRouter = express.Router();

blogRouter.get('/', (request, response) => {
  Blogs.find({}).then(persons => response.json(persons));
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
  const deleted = await Blogs.findByIdAndDelete(request.params.id);
  if (!deleted) {
    response.statusMessage = 'blog not found';
    return response.status(404).json({ error: 'blog not found' });
  }
  response.status(204).end();
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url } = request.body;
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
    url
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
