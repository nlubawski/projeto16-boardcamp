import {Router} from 'express'
import { getRentals, postRentals } from '../controllers/rentals.controllers.js'

const rentalsRouter = Router()
rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', postRentals)
rentalsRouter.post('/rentals/:id/return')

export default rentalsRouter