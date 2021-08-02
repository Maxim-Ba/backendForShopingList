require('dotenv').config()

const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const chatController = require('../controllers/chat.controller')
const router = new Router()

router.post('/', authMiddleware, chatController.getChat)





module.exports = router