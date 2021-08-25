const {Schema, model, ObjectId} = require('mongoose')


const SharedLists = new Schema({
  user:{type:ObjectId, ref: 'User', required:true},
  sharedLists:{type:Array, default:[]},
})

module.exports = model('SharedLists', SharedLists)