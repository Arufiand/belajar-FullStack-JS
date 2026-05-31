import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const numberFormatValidator = (value: string): boolean => {
  if (!value) return false;
  if (value.length < 8) return false;
  const parts = value.split('-');
  if (parts.length !== 2) return false;
  const [first, second] = parts;
  if (!/^\d{2,3}$/.test(first)) return false;
  return /^\d+$/.test(second);
};

const phoneBookSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: {
    type: String,
    required: true,
    validate: {
      validator: numberFormatValidator,
      message: (props: { value: string }) =>
        `${props.value} is not in the correct format`
    }
  }
});

phoneBookSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Phonebook', phoneBookSchema);
