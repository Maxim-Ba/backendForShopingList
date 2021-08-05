const List = require("../models/List");


class WSServise {
  async updateGroups(listID, groups){
    try {
      console.log(groups)

      const sevedLists = await List.findOneAndUpdate(
        {_id:listID}, {groups}, {new:true}
      )
      console.log(sevedLists , '---updateGroups---')

      return sevedLists.groups
    } catch (error) {
      console.log(error)

      return res.status(500).json(error);
    }
  }
  async updateDeletedAndGroups(listID, groups, deleted){
    try {
      const sevedLists = await List.findOneAndUpdate(
        {_id:listID}, {groups, deleted}, {new:true}
      )
      return sevedLists
    } catch (error) {
      console.log(error)
  
      return res.status(500).json(error);
    }


}
}


module.exports = new WSServise()