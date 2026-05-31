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
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Blog', blogSchema);
