import db from "../database/database.connection.js";

export async function getCustomers(req, res){
  try {
    const customers = await db.query(`SELECT * FROM customers`)
    return res.send(customers.rows)
  } catch (error) {
    return res.sendStatus(500)
  }

}