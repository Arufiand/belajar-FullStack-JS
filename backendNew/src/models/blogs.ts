import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5 },
  author: { type: String, required: true, minlength: 5 },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

exports = mongoose.model('Blog', blogSchema);
