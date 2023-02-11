import customerSchema from "../schemas/customers.schema.js";

export function customersValidation(req, res, next){
  const game = req.body
  const {error} = customerSchema.validate(game)
  if(error) return res.sendStatus(400)
  next()
}