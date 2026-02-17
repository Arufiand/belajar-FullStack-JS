const mongoose = require('mongoose');
const { connectIfNeeded } = require('../utils/config');

mongoose.set('strictQuery', false);

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true, minlength: 5 },
  importance: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// ensure we have a connection: pass the env var key so buildUrl can lookup the DB name
connectIfNeeded({ dbEnvName: 'NOTES_DB' });

module.exports = mongoose.model('Note', noteSchema);
