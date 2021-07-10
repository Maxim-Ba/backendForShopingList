const List = require("../models/List")

class ListService{

  // async getLists(){
    
  // }
  // async createList(req, res){
  //   try {
  //     const {name, color } = req.body
  //     const userOwener=req.user.id
  //     console.log(req.body)

  //     const list = new List({
  //       name,
  //       color,
  //       userOwener,
  //       userOwener:[userOwener],
        
  //       })
  //       await list.save();
  //       console.log(list)

  //       return res.json(list);
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(400).json(e);
  //   }
  // }
  // async saveList(){
    
  // }
  // async shareList(){
    
  // }
  // async deleteList(){
    
  // }
}



module.exports = new ListService()