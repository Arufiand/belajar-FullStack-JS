// language: javascript
// file: `part2/mongo.js`

const mongoose = require('mongoose');

const [, , password, dbArg, nameArg, numberArg] = process.argv;

if (!password) {
  console.log('give password as argument');
  process.exit(1);
}

const dbIndex = Number(dbArg);
const dbSelected = dbIndex === 1 ? 'notes' : 'phoneBook';

const url = `mongodb+srv://fullstack_mongo_db:${password}@cluster0.wr65zlp.mongodb.net/${dbSelected}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const notesAppSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

async function main() {
  try {
    await mongoose.connect(url, { family: 4 });

    const schema =
      dbSelected === 'phoneBook' ? phoneBookSchema : notesAppSchema;
    const ListData = mongoose.model(dbSelected, schema);

    if (!nameArg && !numberArg) {
      const docs = await ListData.find({});
      docs.forEach((doc) => {
        if (dbSelected === 'phoneBook') {
          console.log(`${doc.name} ${doc.number}`);
        } else {
          console.log(doc.content);
        }
      });
    } else {
      if (dbSelected === 'phoneBook') {
        const entry = new ListData({ name: nameArg, number: numberArg });
        const saved = await entry.save();
        console.log(`Phonebook entry added: ${saved.name} - ${saved.number}`);
      } else {
        const note = new ListData({ content: nameArg, important: false });
        const saved = await note.save();
        console.log(`Note saved: ${saved.content}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
