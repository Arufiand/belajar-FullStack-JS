const express = require("express");
const app = express();

let notes = [
  { id: 1, title: "First note", importance: true },
  { id: 2, title: "Second note", importance: false },
  { id: 3, title: "Third note", importance: true },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
