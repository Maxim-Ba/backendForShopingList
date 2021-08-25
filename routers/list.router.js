require('dotenv').config()

const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const listController = require('../controllers/list.controller')
const router = new Router()
// const expressWs = require('express-ws')(router);
router.get('/',authMiddleware,listController.getLists)
router.get('/:list',authMiddleware,listController.getList)
router.get('/sharedLists/:userID',authMiddleware,listController.getSharedList)
router.post('/create',authMiddleware, listController.createList)
router.put('/save',authMiddleware, listController.saveList)
router.put('/share',authMiddleware, )
router.delete('/:list', authMiddleware, listController.deleteList)
// router.ws('/save',authMiddleware, listController.saveList)





module.exports = router