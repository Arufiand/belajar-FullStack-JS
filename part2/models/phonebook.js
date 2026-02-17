require("dotenv").config();
const mongoose = require("mongoose");
const { joinUrl } = require("../helper/general_helper");

mongoose.set("strictQuery", false);

const url = joinUrl(process.env.MONGOURL, process.env.PHONEBOOK_DB);

const numberFormatValidator = function (value) {
  if (!value) return false;
  if (value.length < 8) return false;

  const parts = value.split("-");
  if (parts.length !== 2) return false;

  const [first, second] = parts;
  if (!/^\d{2,3}$/.test(first)) return false;
  if (!/^\d+$/.test(second)) return false;

  return true;
};

const connectIfNeeded = async () => {
  if (mongoose.connection.readyState === 0) {
    console.log("connecting to", url);
    try {
      await mongoose.connect(url, { family: 4 });
      console.log("connected to MongoDB");
    } catch (error) {
      console.log("error connecting to MongoDB:", error.message);
    }
  } else {
    console.log(
      "reusing existing mongoose connection (state):",
      mongoose.connection.readyState,
    );
  }
};

connectIfNeeded();

const phoneBookSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: {
    type: String,
    required: true,
    validate: {
      validator: numberFormatValidator,
      message: (props) => `${props.value} is not in the correct format`,
    },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phoneBookSchema);
