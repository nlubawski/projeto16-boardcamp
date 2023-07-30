import gameSchema from "../schemas/game.schema.js";

export function gameValidation(req, res, next){
  const game = req.body
  const {error} = gameSchema.validate(game)
  if(error) return res.sendStatus(400)
  next()
}