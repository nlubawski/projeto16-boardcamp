import db from './../database/database.connection.js';

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

export async function finishRental(req, res) {
  const { id } = req.params
  try {
    const rentalId = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if (rentalId.rows.length === 0) return res.sendStatus(404)
    const rental = rentalId.rows[0];
    if (rental.returnDate) return res.sendStatus(400);
    const diference = new Date().getTime() - new Date(rental.rentDate).getTime();
    const diferenceInDays = Math.floor(diference / (24 * 3600 * 1000));
    let delayFee = 0;
    if (diferenceInDays > rental.daysRented) {
      const addicionalDays = diferenceInDays - rental.daysRented;
      delayFee = addicionalDays * rental.originalPrice;
    };
    await db.query(`UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2`, [delayFee, id]);
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