import db from "../database/database.connection.js";

export async function getCustomers(req, res){
  try {
    const customers = await db.query(`SELECT * FROM customers`)
    return res.send(customers.rows)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function getCustomersById(req, res){
  const {id} = req.params
  try { 
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`,[id])
    if(customer.rows <= 0 ) return res.sendStatus(404)
    return res.send(customer.rows)
  } catch (error) {
    return res.sendStatus(500)
}
}
