const mongoose = require('mongoose');
const { connectIfNeeded } = require('../utils/config');

mongoose.set('strictQuery', false);

const numberFormatValidator = function (value) {
  if (!value) return false;
  if (value.length < 8) return false;

  const parts = value.split('-');
  if (parts.length !== 2) return false;

  const [first, second] = parts;
  if (!/^\d{2,3}$/.test(first)) return false;
  return /^\d+$/.test(second);
};

// ensure we have a connection: pass the env var key so buildUrl can lookup the DB name
connectIfNeeded({ dbEnvName: 'PHONEBOOK_DB' });

const phoneBookSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: {
    type: String,
    required: true,
    validate: {
      validator: numberFormatValidator,
      message: props => `${props.value} is not in the correct format`
    }
  }
});

phoneBookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Phonebook', phoneBookSchema);
