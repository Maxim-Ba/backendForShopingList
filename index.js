require('dotenv').config()

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const routerUser = require('./routers/user.router')
const routerList = require('./routers/list.router')



const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/user', routerUser)
app.use('/api/list', routerList)
const start = async () =>{
  try {
    await mongoose.connect(process.env.DB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, ()=>{
      console.log(PORT)
    })
  } catch (error) {
    console.log(error)
  }

}
start()