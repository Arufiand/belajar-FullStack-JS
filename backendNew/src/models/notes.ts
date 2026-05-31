import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true, minlength: 5 },
  importance: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  users: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

noteSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Note', noteSchema);
