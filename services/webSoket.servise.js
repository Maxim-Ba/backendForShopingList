const List = require("../models/List");
const ChatModel = require("../models/Chats");
const UserModel = require("../models/User");
const SharedLists = require("../models/SharedLists");

class WSServise {
  async updateGroups(listID, groups) {
    try {
      const sevedLists = await List.findOneAndUpdate(
        { _id: listID },
        { groups },
        { new: true }
      );
      return sevedLists.groups;
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async updateDeletedAndGroups(listID, groups, deleted) {
    try {
      const sevedLists = await List.findOneAndUpdate(
        { _id: listID },
        { groups, deleted },
        { new: true }
      );
      return sevedLists;
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async updateUser(listID, userEmail) {
    try {
      const user = await UserModel.findOne({ email: userEmail }).select({
        email: true,
        _id: true,
      });
      if (!user) {
        return null;
      }
      const list = await List.findOne({ _id: listID });
      !list.users.includes(user._id) && list.users.push(user._id);
      await list.save();
      const chat = await ChatModel.findOne({ list: listID });
      !chat.users.includes(user._id) && chat.users.push(user._id);
      await chat.save();
      const newSharedList = await SharedLists.findOne({
        user: user._id,
      });
      console.log(user._id,newSharedList, 'newSharedList updateUser')
      !newSharedList.sharedLists.includes(listID) &&
        newSharedList.sharedLists.push(user._id);
      console.log(newSharedList);
      await newSharedList.save();
      return list.users;
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getNewListThatWasShared(listOwener, userID) {
    try {
      const lists = await List.find({ userOwener: listOwener });
      const filterLists = lists.filter((list) => list.users.includes(userID));
      return filterLists;
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}

module.exports = new WSServise();
