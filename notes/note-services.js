const NotesServices = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },
  createNote(knex, note) {
    return knex("notes")
      .returning(["id", "note_name", "content", "folder_id"])
      .insert(note);
  },
  getNoteById(knex, id) {
    return knex
      .from("notes")
      .select("*")
      .where("id", id);
    // .first();
  },
  deleteNote(knex, id) {
    return knex("notes")
      .where({ id })
      .delete();
  },
  updateNotes(knex, id, newUserFields) {
    return knex("notes")
      .where({ id })
      .update(newUserFields);
  }
};

module.exports = {
  NotesServices
};
