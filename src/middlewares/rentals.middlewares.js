import rentalSchema from "../schemas/rental.schema.js";

export function rentalValidation(req, res, next){
  const rental = req.body
  const {error} = rentalSchema.validate(rental)
  if(error) return res.sendStatus(400)
  next()
}