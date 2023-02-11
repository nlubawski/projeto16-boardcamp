import {Router} from 'express'
import {getGames, postGames} from '../controllers/games.controller.js'
import { gameValidation } from '../middlewares/games.middleware.js'

const gamesRouter = Router()
gamesRouter.get('/games', getGames)
gamesRouter.post('/games', gameValidation, postGames)

export default gamesRouter