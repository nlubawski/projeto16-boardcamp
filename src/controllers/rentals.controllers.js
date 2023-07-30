import db from './../database/database.connection.js'
import dayjs from 'dayjs'

export async function getRentals(req, res) {
  try {
    const result = await db.query({
      text: `SELECT rentals.*, customers.name AS customer, games.name FROM rentals JOIN customers ON customers.id = rentals."customerId" 
    JOIN games ON games.id = rentals."gameId"`, rowMode: "array"
    })
    return res.send(result.rows.map(rentalToObject))
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    if (daysRented <= 0) return res.sendStatus(400)
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId])
    if (customer.rows.length === 0) return res.sendStatus(400)
    const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
    if (game.rows.length === 0) return res.sendStatus(400)  

    const gameStock = await db.query(`SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`, [gameId])
    if (gameStock.rows.length >= game.rows[0].stockTotal) return res.sendStatus(400)

    const originalPrice = daysRented * game.rows[0].pricePerDay;
    if (originalPrice < 0) return res.sendStatus(400)
    
    const rentDate = new Date().toISOString().split("T")[0]
    if (!rentDate)return res.sendStatus(400)
  
    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, NOW(), $3, null, $4, null)`, [customerId, gameId, daysRented, originalPrice])
    res.sendStatus(201)
    } catch (error) {
    return res.status(500).send("Erro interno do servidor.");
  }
}

export async function finishRental(req, res) {
  const { id } = req.params
  try {
    const rentalId = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if (rentalId.rows.length === 0) return res.sendStatus(404)
    const rental = rentalId.rows[0]
    if (rental.returnDate) return res.sendStatus(400)
    
    const returnDate = dayjs().format('YYYY-MM-DD')
    const dateExpiriesAt = dayjs(rental.rentDate, 'day').add(rental.daysRented, 'day')
    const diffDays = dayjs().diff(dateExpiriesAt, 'day')
    let delayFee = diffDays > 0 ? diffDays * (rental.originalPrice / rental.daysRented) : 0

    await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,[returnDate, delayFee, id])
    return res.sendStatus(200)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function deleteRental(req, res) {
  const {id} = req.params;
  try {
    const rentalId = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if (rentalId.rowCount === 0) return res.sendStatus(404)
    if (rentalId.rows[0].returnDate === null) return res.sendStatus(400)
    await db.query(`DELETE FROM rentals WHERE id = $1`,[id])
    return res.sendStatus(200)
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