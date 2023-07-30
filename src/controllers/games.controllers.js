import db from '../database/database.connection.js';

export async function getGames(req, res){
  try {
    const result = await db.query(`SELECT * FROM games`)
    return res.send(result.rows)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function postGames(req, res){
  const {name, image, stockTotal, pricePerDay} = req.body
  try { 
    const haveGame = await db.query(`SELECT * FROM games WHERE name=$1`,[name])
    if(haveGame.rows.length > 0) return res.sendStatus(409)
    await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
    VALUES ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay])
    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(500)
  }
}