require("dotenv").config();
const mongoose = require("mongoose");
const { joinUrl } = require("../helper/general_helper");

mongoose.set("strictQuery", false);

const url = joinUrl(process.env.MONGOURL, process.env.NOTES_DB);

console.log("connecting to", url);
mongoose
  .connect(url, { family: 4 })

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
