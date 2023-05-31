const { Router } = require('express');
const Ghost = Router();
const { getStory } = require('../helpers/stories');

Ghost.post('/', async (req, res) => {
  const { userMove } = req.body;
  console.log('req', req);
  console.log('userMove', userMove);
  try {
    res.status(201).send(userMove);
  } catch (err) {
    console.error('Failed to POST text to API:', err);
    res.sendStatus(500);
  }
})

module.exports = {
  Ghost,
}