import db from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers`)
    const resultCustomers = customers.rows.map(row => { return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      cpf: row.cpf,
      birthday: dayjs(row.birthday).format("YYYY-MM-DD")
    }})
    return res.send(resultCustomers)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export async function getCustomersById(req, res) {
  const { id } = req.params
  try {
    let customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id])
    if (customer.rows <= 0) return res.sendStatus(404)
    customer = customer.rows[0]
    const resultCustomer = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      cpf: customer.cpf,
      birthday: dayjs(customer.birthday).format("YYYY-MM-DD")
    }
    return res.send(resultCustomer)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function postCustomers(req, res){
  const {name, phone, cpf, birthday} = req.body
  try { 
    const haveCustomer = await db.query(`SELECT * FROM customers WHERE cpf=$1`,[cpf])
    if(haveCustomer.rows.length > 0) return res.sendStatus(409)
    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) 
    VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])
    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function putCustomersById(req, res){
  const {name, phone, cpf, birthday} = req.body
  const { id } = req.params 
  try { 
    const cpfOtherCustumer = await db.query(`SELECT cpf FROM customers WHERE id <> $1 AND cpf = $2`, [id, cpf])
    if (cpfOtherCustumer.rows.length > 0) return res.sendStatus(409)
    await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 
    WHERE id = $5`, [name, phone, cpf, birthday, id])
    return res.sendStatus(200)
  } catch (error) {
    return res.sendStatus(500)
  }
}