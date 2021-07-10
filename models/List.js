const {model, Schema, ObjectId} = require('mongoose')


const List = new Schema({
  name: {type:String, required: true, default:""},
  color: {type:String, required: true, default:"#007bff"},
  userOwener: {type:ObjectId, ref: 'User', required:true},
  users:{type:Array, },
  groups:{type:Array, default: [
    {
      color: "red",
      items: [],
    },
    {
      color: "green",
      items: [],
    },
    {
      color: "blue",
      items: []
    },
    {
      color: "gray",
      items: [],
    },
    {
      color: "cyan",
      items: [],
    },
    {
      color: "yellow",
      items: [],
    },
    {
      color: "indigo",
      items: [],
    },
    {
      color: "midnightblue",
      items: [],
    },
    {
      color: "salmon",
      items: [],
    },
    {
      color: "orange",
      items: [],
    },
  ]},
  deleted:{type:Array, default: []}
})

  
  module.exports = model('List',List)