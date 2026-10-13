import { Router } from "express";
import { uploadMessMedia } from "../middleware/mediamiddleware";
import { mediaControll } from "../controller/mediacontroller";

const mediaRouter = new Router()

mediaRouter.post('/upload/message', uploadMessMedia, mediaControll.MessageMedia)
export default mediaRouter