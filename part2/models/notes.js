require("dotenv").config();
const mongoose = require("mongoose");
const { joinUrl } = require("../helper/general_helper");

mongoose.set("strictQuery", false);

const url = joinUrl(process.env.MONGOURL, process.env.NOTES_DB);

const connectIfNeeded = async (retries = 2, delay = 1500) => {
  if (mongoose.connection.readyState !== 0) {
    console.log(
      "reusing existing mongoose connection (state):",
      mongoose.connection.readyState,
    );
    return;
  }

  if (!url) {
    console.error("Missing Mongo URL env var (MONGOURL or MONGODB_URI)");
    return;
  }

  console.log("attempting to connect to MongoDB:", url);
  try {
    await mongoose.connect(url, {
      family: 4,
      serverSelectionTimeoutMS: 5000, // fail fast for clearer errors
    });
    console.log("connected to MongoDB");
  } catch (err) {
    console.error(
      "error connecting to MongoDB:",
      err && err.message ? err.message : err,
    );
    if (retries > 0) {
      console.log(`retrying in ${delay}ms (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
      return connectIfNeeded(retries - 1, delay * 2);
    }
  }
};

connectIfNeeded();

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  importance: { type: Boolean, default: false }, // ensure importance is stored
  date: { type: Date, default: Date.now },
});
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
