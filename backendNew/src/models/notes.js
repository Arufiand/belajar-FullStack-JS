const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true, minlength: 5 },
  importance: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
