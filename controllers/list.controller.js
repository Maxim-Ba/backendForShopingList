const List = require("../models/List");
const Chat = require("../models/Chats");

class ListController {
  async getLists(req, res) {
    try {
      const lists = await List.find({
        userOwener: req.user.id,
      })
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
      const chat = new Chat({
        name,
        messages: [],
        list: list._id,
        users:[userOwener]
      });
      await chat.save();
      return res.json(list);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async saveList(req, res) {
    try {
      console.log(req.body)

      const { name, color, _id, groups, deleted } = req.body;
      const sevedLists = await List.findOneAndUpdate(
        {_id:_id}, {name, color, groups, deleted}, {new:true}
      )
      console.log(sevedLists)

      return res.json(sevedLists)
    } catch (error) {
      console.log(error)

      return res.status(500).json(error);
    }
  }
  async getList(req, res) {
    try {
      const list = await List.findOne({
        _id: req.params.list,
      })
      return res.json(list)
    } catch (error) {
      return res.status(500).json({ message: "Can not get list" });
    }
  }
  async shareList() {}
  async deleteList(req, res) {
    try {
      console.log(req.params.list)

      await List.findOneAndDelete({_id: req.params.list})
      await Chat.findOneAndDelete({list: req.params.list})

      console.log('del')
      const lists = await List.find({
        userOwener: req.user.id,
      })
      return res.json(lists)
    } catch (error) {
      return res.status(500).json(error);

    }
  }
}

module.exports = new ListController();
