import { Router } from "express"
import { authController } from "../controller/authcontroller"
const router = new Router()

router.post("/register", authController.reg)
router.post("/login", authController.login)
router.get('/getallusers', authController.allUsers)

export default router