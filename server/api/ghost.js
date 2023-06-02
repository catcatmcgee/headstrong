const { Router } = require('express');
const Ghost = Router();
const { getNextMove } = require('../helpers/ghost');

Ghost.post('/', async (req, res) => {
  const { game } = req.body;
  const nextMove = getNextMove(game);
  try {
    res.status(201).send(nextMove);
  } catch (err) {
    console.error('Failed to POST text to API:', err);
    res.sendStatus(500);
  }
});


module.exports = {
  Ghost,
}