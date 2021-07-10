require('dotenv').config()

const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const listController = require('../controllers/list.controller')
const ListService = require('../services/list.service')
const router = new Router()

router.get('/',authMiddleware,listController.getLists)
router.post('/create',authMiddleware, listController.createList)
router.put('/save',authMiddleware, )
router.put('/share',authMiddleware, )
router.delete('/', authMiddleware, )






module.exports = router