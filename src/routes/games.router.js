import {Router} from 'express'
import {getGames, postGames} from '../controllers/games.controllers.js'
import { gameValidation } from '../middlewares/games.middlewares.js'

const gamesRouter = Router()
gamesRouter.get('/games', getGames)
gamesRouter.post('/games', gameValidation, postGames)

export default gamesRouter