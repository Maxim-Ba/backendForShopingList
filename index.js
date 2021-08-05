require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const routerUser = require('./routers/user.router')
const routerList = require('./routers/list.router')
const routerChat = require('./routers/chat.router')
const http = require("http");
const WebSocket = require('ws')
const WSController = require('./controllers/webSocket.controller')

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app);

app.use(cors())
app.use(express.json())

app.use('/api/user', routerUser)
app.use('/api/list', routerList)
app.use('/api/chat', routerChat)

const wss = new WebSocket.Server({ server, clientTracking : true });

wss.on('connection', (ws) => {
  ws.on('message', (m)=> console.log(JSON.parse(m)))

  try {
    WSController.onMessage(ws, wss)
    WSController.onClose(ws)
  } catch (error) {
  }
})

const start = async () =>{
  try {
    await mongoose.connect(process.env.DB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    server.listen(PORT, ()=>{
      console.log(PORT)
    })
  } catch (error) {
    console.log(error)
  }

}
start();