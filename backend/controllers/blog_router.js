'use strict';
const express = require('express');
const Blogs = require('../models/blogs');
const blogRouter = express.Router();

blogRouter.get('/', (request, response) => {
  Blogs.find({}).then(persons => response.json(persons));
});

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const Blog = await Blogs.findById(request.params.id);
    if (!Blog) {
      response.statusMessage = 'Blog not found';
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.json(Blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const deleted = await Blogs.findByIdAndDelete(request.params.id);
    if (!deleted) {
      response.statusMessage = 'blog not found';
      return response.status(404).json({ error: 'blog not found' });
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/', async (request, response, next) => {
  const { title, author, url } = request.body;
  if (!title || !author || !url) {
    return response.status(400).json({ error: 'title, author & url required' });
  }

  try {
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
  } catch (error) {
    next(error);
  }
});

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body;
  const update = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  try {
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
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
