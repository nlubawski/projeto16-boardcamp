import db from './../database/database.connection.js';

export async function getRentals(req, res){
  try {
    const result = await db.query(`SELECT rentals.*, customers.name AS customer, games.name FROM rentals JOIN customers ON customers.id = rentals."customerId" 
    JOIN games ON games.id = rentals."gameId"`)
    return res.send(result.rows)
  } catch (error) {
    return res.sendStatus(500)
  }
}