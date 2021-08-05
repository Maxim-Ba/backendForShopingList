const ChatModel = require("../models/Chats");
const ListModel = require("../models/List");
const UserModel = require("../models/User");

const WSServise = require("../services/webSoket.servise")

class Chat {
  async onMessage(ws, wss) {
    ws.on("message", async (m) => {
      const mesData = JSON.parse(m);
      console.log(mesData, 'onMessage const mesData' );
      switch (mesData.event) {
        case "updateChat":
          const messagesInDB = await ChatModel.findOne({
            list: mesData.listID,
          });
          messagesInDB.messages.push({
            message: mesData.message,
            email: mesData.email,
            userID: mesData.user,
          });
          const sevedMessages = await ChatModel.findOneAndUpdate(
            { list: mesData.listID },
            { messages: messagesInDB.messages },
            { new: true }
          );
          wss.clients.forEach((client) => {
            if (client.listID === mesData.listID) {
              client.send(
                JSON.stringify({
                  event: "updateChat",
                  message: sevedMessages.messages,
                })
              );
            }
          });
          break;
        case "updateUser":
          // добовление или удаления из чата-списка user
          wss.clients.forEach((client) => {
            if ((client.listID === mesData.listID) ) {
              client.send(
                JSON.stringify({
                  event: "updateUser",
                  users: sevedMessages.users,
                })
              );
            }
          });
          break;
        case "updateGroups":
          // добовление в список item
          const newGroups = await WSServise.updateGroups(mesData.listID, mesData.groups)
          console.log(newGroups, '///////updateGroups/////////' );
          wss.clients.forEach((client) => {
            if ((client.listID === mesData.listID) && (client.userID !== mesData.userID) ) {
              client.send(
                JSON.stringify({
                  event: "updateGroups",
                  groups: newGroups,
                })
              );
            }
          });
          break;
        case "updateDeletedAndGroups":
          const {groups, deleted} = await WSServise.updateDeletedAndGroups(mesData.listID, mesData.groups, mesData.deleted)      
          wss.clients.forEach((client) => {
            if (client.listID === mesData.listID && (client.userID !== mesData.userID)) {
              client.send(
                JSON.stringify({
                  event: "updateDeletedAndGroups",
                  groups: groups,
                  deleted: deleted,
                })
              );
            }
          });
          break;
        case "updateNameOfList":
          // изменить имя
          wss.clients.forEach((client) => {
            if (client.listID === mesData.listID) {
              client.send(
                JSON.stringify({
                  event: "updateNameOfList",
                  color: sevedMessages.color,
                })
              );
            }
          });
          break;
        case "updateColorOfList":
          // изменить color

          wss.clients.forEach((client) => {
            if (client.listID === mesData.listID) {
              client.send(
                JSON.stringify({
                  event: "updateColorOfList",
                  color: sevedMessages.color,
                })
              );
            }
          });
          break;

        case "firstConnect":
          // инициализируем клиентский ws
          console.log("---------------");
          ws.userID = mesData.userID;
          ws.listID = mesData.listID;
          // запушить в чат нового пользователя
          break;
        default:
          break;
      }
    });
  }

  onClose(ws) {
    ws.on("close", (m) => {
      console.log("клиент отключился");
      console.log(m);
    });
  }
  async getChat(req, res) {
    try {
      const listID = req.body.listID;
      const chatFromDB = await ChatModel.findOne({
        list: listID,
      });
      const users = await UserModel.find({ _id: chatFromDB.users }).select({
        email: true,
        _id: true,
      });
      chatFromDB.users = users;
      res.send(chatFromDB);
    } catch (error) {
      res.send(error);
    }
  }
}
module.exports = new Chat();
