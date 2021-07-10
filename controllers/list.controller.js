const List = require("../models/List");

class ListController {
  async getLists(req, res) {
    try {
      const lists = await List.find({
        userOwener: req.user.id,
      })
      console.log( lists)
      return res.json(lists)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Can not get files" });
    }
  }
  async createList(req, res) {
    try {
      const { name, color } = req.body;

      const userOwener = req.user.id;
      const list = new List({
        name,
        color,
        userOwener,
        users: [userOwener],
      });
      await list.save();

      return res.json(list);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async saveList() {}
  async shareList() {}
  async deleteList() {}
}

module.exports = new ListController();
