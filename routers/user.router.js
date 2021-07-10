require('dotenv').config()

const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware')
const { check, validationResult } = require('express-validator')

const router = new Router()


router.post('/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shoter than 16')
      .isLength({ min: 3, max: 16 }),
  ],
  async (req, res) => {
    console.log(req.body)
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
      return res.json({ message: 'User was created' })
    } catch (error) {
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
  router.put('/password',
  async (req, res) => {
    try {
      
    } catch (error) {
      res.send({ message: 'error on server' })
    }
  })




module.exports = router