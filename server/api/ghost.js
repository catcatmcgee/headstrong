const { Router } = require('express');
const Ghost = Router();
const { getNextMove } = require('../helpers/ghost');
const fs = require('fs');
const wordTree = JSON.parse(fs.readFileSync('../../wordtree.json', 'utf8'));
const winningTree = JSON.parse(fs.readFileSync('winningtree.json', 'utf8'))

Ghost.post('/', async (req, res) => {
  const { game }  = req.body;
  const nextMove = getNextMove(game, winningTree, wordTree);
  console.log('nextMove', nextMove);
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