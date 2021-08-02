const ChatModel = require("../models/Chats");
const ListModel = require("../models/List");
const UserModel = require("../models/User");

class Chat {
  async onMessage(ws, wss) {
    ws.on("message", async (m) =>  {
      const mesData = JSON.parse(m);
      console.log(mesData);
      switch (mesData.event) {
        case "message":
          const messagesInDB = await ChatModel.findOne({
            list: mesData.listID,
          });
          messagesInDB.messages.push({
            message: mesData.message,
            email: mesData.email,
            userID: mesData.user
          });
          const sevedMessages = await ChatModel.findOneAndUpdate(
            { list: mesData.listID },
            { messages: messagesInDB.messages },
            { new: true }
          );
          wss.clients.forEach((client) => {
            if (client.listID === mesData.listID) {
              // запушить сообщение в базу
              // отпраавить сообщение в чат
              client.send(
                JSON.stringify({
                  event: 'updateChat',
                  message: sevedMessages.messages,
                })
              );
            }
          });
          break;
        case "firstConnect":
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
  async getChat(req, res){

    try {
      const listID = req.body.listID
      const chatFromDB = await ChatModel.findOne({
        list: listID,
      });
      const users = await UserModel.find({_id:chatFromDB.users}).select({ email:true, _id:true})
      console.log(users,  '__users__')
      chatFromDB.users = users
      console.log(chatFromDB,  '__chatFromDB__')

      res.send(chatFromDB)
    } catch (error) {
      res.send(error)
    }
  }
}
module.exports = new Chat();
