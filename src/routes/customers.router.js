import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers } from "../controllers/customers.controller.js";

const customersRouter = Router()
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomersById)
customersRouter.post('/customers', postCustomers)


export default customersRouter