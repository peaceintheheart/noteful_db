const express = require("express");
const { NotesServices } = require("./note-services");
const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesServices.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folder_id } = req.body;
    const newNote = { folder_id, note_name, content };
    console.log(newNote);

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    NotesServices.createNote(req.app.get("db"), newNote)
      .then(notes => {
        res.status(201).json(notes[0]);

        // .json(serializeNote(note));
      })
      .catch(err => console.log(err));
  });

notesRouter
  .route("/:note_id")
  .get((req, res, next) => {
    const { note_id } = req.params;
    NotesServices.getNoteById(req.app.get("db"), note_id)
      .then(note => {
        if (!note) {
          return res
            .status(404)
            .json({ error: { message: `note doesn't exist` } });
        }
        res.status(200);
        res.json(note).next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    NotesServices.deleteNote(req.app.get("db"), req.params.note_id)
      .then(() => {
        res
          .status(204)
          .send("deleted")
          .end();
      })
      .catch(next);
  })
  .put(jsonParser, (req, res, next) => {
    const { content, note_name } = req.body;
    const noteToUpdate = { content, note_name };
    const { id } = req.params;
    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: "Note must contain name and content" }
      });
    }
    NotesServices.updateNotes(req.app.get("db"), id, noteToUpdate).then(() => {
      res
        .status(200)
        .send(`Note with id ${id} updated`)
        .end()
        .catch(next);
    });
  });
module.exports = notesRouter;
