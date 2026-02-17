const express = require('express')
const phonebook = require('../models/phonebook')
const phonebookInfoRouter = express.Router()

phonebookInfoRouter.get('/', (request, response) => {
  const count = Array.isArray(phonebook)
    ? phonebook.length
    : Object.keys(phonebook).length
  response.send(`Phonebook has info for ${count} people<br>${new Date()}`)
})

module.exports = phonebookInfoRouter
