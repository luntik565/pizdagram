import { Router } from "express"
import { authController } from "./controller/controller"
import { roomController } from "./controller/room"
const router = new Router()

router.post("/register", authController.reg)
router.post("/login", authController.login)
router.get('/getallusers', authController.allUsers)
router.get('/myrooms/:id', roomController.getmyroom)

export default router