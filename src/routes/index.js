import { Router } from "express"
import customersRouter from "./customers.router.js"
import gamesRouter from "./games.router.js"

const router = Router()
router.use(gamesRouter)
router.use(customersRouter)


export default router