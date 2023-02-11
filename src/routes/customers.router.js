import { Router } from "express";
import { getCustomers, getCustomersById } from "../controllers/customers.controller.js";

const customersRouter = Router()
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customer/:id', getCustomersById)


export default customersRouter