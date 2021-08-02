const {model, Schema, ObjectId} = require('mongoose')


const Chat = new Schema({
  name: {type:String, required: true},
  users: {type:Array, },
  // emails: {type:Array, },
  messages: {type:Array, },
  list: {type:Schema.Types.ObjectId, ref: 'List', required: true}
})
  
  module.exports = model('Chat',Chat)