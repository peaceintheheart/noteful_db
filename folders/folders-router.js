const express = require("express");
const { FolderServices } = require("./folder-services");
const folderRouter = express.Router();
const jsonParser = express.json();

folderRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FolderServices.getAllFolders(knexInstance)
      .then(folders => res.json(folders))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };

    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    FolderServices.createFolder(req.app.get("db"), newFolder)
      .then(folder => {
        res.status(201).json(folder[0]);
      })
      .catch(next);
  });

folderRouter
  .route("/:folder_id")
  .get((req, res, next) => {
    const { folder_id } = req.params;

    FolderServices.getFolderById(req.app.get("db"), folder_id)
      .then(folder => {
        if (!folder) {
          return res.status(404).send(`folder doesn't exist`);
        }
        res.json(folder);
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { folder_id } = req.params;

    FolderServices.deleteFolder(req.app.get("db"), folder_id)
      .then(() => {
        res
          .status(204)
          .send(`Folder with id ${folder_id} deleted`)
          .end();
      })
      .catch(next);
  })
  .put(jsonParser, (req, res, next) => {
    const { folder_id } = req.params;
    const { name } = req.body;
    const folderToUpdate = { name };
    console.log(folderToUpdate);
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain name`
        }
      });

    FolderServices.updateFolder(req.app.get("db"), folder_id, folderToUpdate)
      .then(() => {
        res
          .status(200)
          .send(`Folder with id ${folder_id} updated`)
          .end();
      })
      .catch(next);
  });
module.exports = folderRouter;
