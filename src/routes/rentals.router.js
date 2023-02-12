import {Router} from 'express'
import { getRentals, postRentals } from '../controllers/rentals.controllers.js'
import { rentalValidation } from '../middlewares/rentals.middleware.js'

const rentalsRouter = Router()
rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', rentalValidation, postRentals)
rentalsRouter.post('/rentals/:id/return')

export default rentalsRouter