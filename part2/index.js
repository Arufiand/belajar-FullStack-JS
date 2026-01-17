const http = require("http");

let notes = [
  { id: 1, title: "First note", importance: true },
  { id: 2, title: "Second note", importance: false },
  { id: 3, title: "Third note", importance: true },
];

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(JSON.stringify(notes, null, 2));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
