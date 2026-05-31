import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // don't reveal the hashed password
    delete returnedObject.passwordHash;
  }
});

exports = mongoose.model('User', userSchema);
