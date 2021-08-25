require('dotenv').config()

const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware')
const { check, validationResult } = require('express-validator')
const List = require('../models/List')
const Chat = require('../models/Chats')
const SharedLists = require('../models/SharedLists')

const router = new Router()


router.post('/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shoter than 16')
      .isLength({ min: 3, max: 16 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Uncorrect reqest', errors })
      }
      const { email, password } = req.body
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res.status(400).json({ message: `User with ${email} already exist` })
      }
      const hashPassword = await bcrypt.hash(password, 8)
      const user = new User({ email, password: hashPassword })
      await user.save()
      // -------------
      const newList = new List({
        name: 'Новый список',
        color: '#4caf50',
        userOwener: user._id,
        users: [user._id],
      });
      await newList.save()
      // ------------
      const chat = new Chat({
        name: newList.name,
        messages: [],
        list: newList._id,
        users:[newList.userOwener]
      });
      await chat.save();
      // --------------
      const sharedList = new SharedLists({
        user:user._id,
      });
      await sharedList.save()
      // --------------
      return res.json({ message: 'User was created' })
    } catch (error) {
      console.log(error)
      res.send({ message: 'error on server' })
    }
  })

router.post('/login',
  async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: 'User dont found' })
      }
      const isPasValid = bcrypt.compareSync(password, user.password)
      if (!isPasValid) {
        return res.status(404).json({ message: 'Invalid password' })
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" })
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar
        }
      })
    } catch (error) {
      console.log(error)

      res.send({ message: 'error on server' })
    }
  })

router.get('/auth',authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({_id:req.user.id})
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" })
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar
        }
      })
    } catch (error) {
      console.log(error)
      res.send({ message: 'error on server' })
    }
  })

  router.put('/changePassword',
  [
    check('email', 'NewPassword must be longer than 3 and shoter than 16')
      .not().isEmpty(),
      check('password', 'NewPassword must be longer than 3 and shoter than 16')
      .not().isEmpty(),
      check('newPassword', 'NewPassword must be longer than 3 and shoter than 16')
      .isLength({ min: 3, max: 16 }),
  ],
  async (req, res) => {
    try {
      const {email, password, newPassword } = req.body
      const user = await User.findOne({ email })
      
      const isPasValid = bcrypt.compareSync(password, user.password)
      if (!isPasValid) {
        return res.status(406).json({ message: 'Invalid password' })
      }
      const hashPassword = await bcrypt.hash(newPassword, 8)
      const userUpdated = await User.findOneAndUpdate({ _id: user._id }, { password:hashPassword },{ new: true })

      return res.json({
        message: 'Пароль успешно изменен'
      })
    } catch (error) {
      res.send({ message: 'error on server' })
    }
  })



module.exports = router