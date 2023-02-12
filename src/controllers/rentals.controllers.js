import db from './../database/database.connection.js';

export async function getRentals(req, res) {
  try {
    const result = await db.query({text: `SELECT rentals.*, customers.name AS customer, games.name FROM rentals JOIN customers ON customers.id = rentals."customerId" 
    JOIN games ON games.id = rentals."gameId"`, rowMode: "array"})
    return res.send(result.rows.map(rentalToObject))
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId])
    if (customer.rows.length <= 0) return res.sendStatus(400)
    const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
    if (game.rows.length <= 0) return res.sendStatus(400)
    const result = await db.query(`SELECT id FROM rentals WHERE "gameId" = $1 AND 
    "returnDate" IS null`, [gameId])
    if (result.rows.length === game.stockTotal) return res.sendStatus(400)
    const originalPrice = daysRented * game.rows[0].pricePerDay;
    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, NOW(), $3, null, $4, null)`, [customerId, gameId, daysRented, originalPrice]);
    console.log('aqui nao')
    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(500)
  }
}

function rentalToObject(row) {
  const [
    id, customerId, gameId,
    rentDate, daysRented, returnDate,
    originalPrice, delayFee, customerName,
    gameName
  ] = row;
  return {
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customer: {
      id: customerId,
      name: customerName
    },
    game: {
      id: gameId,
      name: gameName
    }
  }
}