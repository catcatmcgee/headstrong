const { Router } = require('express');
const { getNextMove, getCurrentNode, getWordFromFragment } = require('../helpers/ghost');
const { getChallengeResults } = require('../helpers/webster');
const fs = require('fs');
const wordTree = JSON.parse(fs.readFileSync('wordtree.json', 'utf8'));
const winningTree = JSON.parse(fs.readFileSync('winningtree.json', 'utf8'))

const Ghost = Router();

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

Ghost.get('/', async(req, res) => {
  const word  = req.query.game;
  const currentNode = getCurrentNode(word, wordTree);
  if(!currentNode){
    res.status(200).send(null);
  }
  const wholeWord = getWordFromFragment(word, currentNode, wordTree)
  if(!wholeWord){
    res.status(200).send(null);
  }
  try {
    const challengeResults = await getChallengeResults(wholeWord);
    console.log('challenge Results inside ghost router', challengeResults)
    res.status(200).send(challengeResults);
  } catch (err) {
    console.log('Failed Challenge Lookup', err);
  }
})

module.exports = {
  Ghost,
}