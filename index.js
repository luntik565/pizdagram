import express from "express"
import router from "./router"
import { createServer } from "http"
import { Server } from 'socket.io'
import cors from 'cors'
import initChat from "./socket/sockets"
const app = express()
const httpServer = createServer(app)

app.use(cors())
app.use(express.json())
app.use("/auth", router)

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

initChat(io)

httpServer.listen(8000, '0.0.0.0', ()=>{
    console.log("сервак запущен");
})