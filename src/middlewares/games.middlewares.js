import gameSchema from "../schemas/game.schema.js";

export function gameValidation(req, res, next){
  const game = req.body
  const validation = gameSchema.validateAsync(game)
  if(validation.error) return res.sendStatus(400)
  next()
}