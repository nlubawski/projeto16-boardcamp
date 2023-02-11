import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, putCustomersById } from "../controllers/customers.controller.js";
import { customersValidation } from "./../middlewares/customers.middleware.js";

const customersRouter = Router()
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomersById)
customersRouter.post('/customers', customersValidation ,postCustomers)
customersRouter.put('/customers/:id', customersValidation, putCustomersById)


export default customersRouter