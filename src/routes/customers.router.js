import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers } from "../controllers/customers.controller.js";
import { customersValidation } from "./../middlewares/customers.middleware.js";

const customersRouter = Router()
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomersById)
customersRouter.post('/customers', customersValidation ,postCustomers)


export default customersRouter