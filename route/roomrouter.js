import { Router } from "express";
import { roomController } from "../controller/roomcontroller";
const roomRouter = new Router()

roomRouter.get('/myrooms/:id', roomController.getmyroom)

export default roomRouter