function joinUrl(base = "", path = "") {
  if (!base) throw new Error("MONGOURL is required");
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

const generateId = (notes) => {
  // generate an id that is unique across notes and phonebook
  const maxNoteId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const maxPersonId =
    phonebook.length > 0 ? Math.max(...phonebook.map((p) => p.id)) : 0;
  return Math.max(maxNoteId, maxPersonId) + 1;
};

module.exports = { joinUrl, generateId };
