import {Router} from 'express'
import { getRentals, postRentals, deleteRental, finishRental } from '../controllers/rentals.controllers.js'
import { rentalValidation } from '../middlewares/rentals.middlewares.js'

const rentalsRouter = Router()
rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', rentalValidation, postRentals)
rentalsRouter.post('/rentals/:id/return', finishRental)
rentalsRouter.delete('/rentals/:id', deleteRental)

export default rentalsRouter