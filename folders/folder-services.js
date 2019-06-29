const FolderServices = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },

  getFolderById(knex, folder_id) {
    return knex
      .from("folders")
      .select("*")
      .where("folder_id", folder_id)
      .first();
  },
  createFolder(knex, folder) {
    return knex("folders")
      .returning(["folder_id", "name"])
      .insert(folder);
  },
  deleteFolder(knex, folder_id) {
    return knex("folders")
      .where({ folder_id })
      .delete();
  },
  updateFolder(knex, folder_id, newFolderFields) {
    return knex("folders")
      .where("folder_id", folder_id)
      .update(newFolderFields);
  }
};

module.exports = { FolderServices };
