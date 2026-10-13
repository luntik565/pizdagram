import path from "path"
import express from "express"
import router from "./route/authrouter"
import roomRouter from "./route/roomrouter"
import mediaRouter from "./route/mediarouter"
import { createServer } from "http"
import { Server } from 'socket.io'
import cors from 'cors'
import initChat from "./socket/sockets"
const app = express()
const httpServer = createServer(app)

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json())
app.use("/uploads", express.static(path.join(process.cwd(), 'uploads')))
app.use("/auth", router)
app.use("/room", roomRouter)
app.use("/api", mediaRouter)

const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            callback(null, true);
        },
        methods: ["GET", "POST"],
        credentials: true
    }
})

initChat(io)

httpServer.listen(8000, '0.0.0.0', ()=>{
    console.log("сервак запущен");
})