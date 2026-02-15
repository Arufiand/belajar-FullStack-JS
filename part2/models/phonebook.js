require("dotenv").config();
const mongoose = require("mongoose");
const { joinUrl } = require("../helper/general_helper");

mongoose.set("strictQuery", false);

const url = joinUrl(process.env.MONGOURL, process.env.PHONEBOOK_DB);

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
  name: { type: String, required: true },
  number: { type: String, required: true },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phoneBookSchema);
