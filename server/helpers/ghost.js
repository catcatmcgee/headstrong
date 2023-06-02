const e = require('express');
const fs = require('fs');
const path = require('path');
console.log(__dirname)

const wordArray = fs.readFileSync('words.txt', 'utf8').split('\n');
const wordTree = JSON.parse(fs.readFileSync('wordtree.json', 'utf8'));


const winners = ['ahead', 'black', 'bleed', 'blimp', 'bloat', 'bluff', 'clarity', 'cleft', 'cliff', 'cloak', 'cluck', 'draft', 'dregs', 'drift', 'droll', 'drunk', 'dryly', 'equal', 'equator', 'frail', 'freak', 'friar', 'frock', 'fruit', 'graft', 'grenade', 'grill', 'groan', 'gruff', 'illegal', 'knack', 'knead', 'knife', 'knifing', 'knock', 'knuckle', 'lying', 'lymph', 'lynch', 'lyric', 'nylon', 'nymph', 'ozone', 'pneumatic', 'quack', 'quell', 'quick', 'quonset', 'squeamish', 'squeeze', 'squeezing', 'squelch', 'twain', 'tweed', 'twice', 'twofold', 'ulcer', 'ultra', 'vulture', 'whack', 'wheat', 'which', 'whoop', 'yield']

const getCurrentNode = (word, node) => {
  if (word.length === 0) {
    return node;
  } else if (typeof node.end === 'string') {
    return node.end;
  }

  let child = node[word.charAt(0)];
  if (child) {
    return getCurrentNode(word.substring(1), child);
  }
  return null;
}

function getNextMove(game, winningTree, wordTree) {
  const currentNode = getCurrentNode(game, winningTree) || getCurrentNode(game, wordTree) || null;
  console.log('currentNode', currentNode);
  if (currentNode) {
    if (currentNode.end === 'odd') {
      return {end :'odd'}
    }
    const keys = Object.keys(currentNode);
    const validKeys = keys.filter((key) => currentNode[key].end !== 'even');
    console.log('keys, validKeys', keys, validKeys)
    if(!validKeys.length){
      const nextMove = keys[Math.floor(Math.random() * keys.length)];
      return {letter: nextMove, end: 'even'};
    }

    const nextMove = validKeys[Math.floor(Math.random() * validKeys.length)];
    return nextMove;
  }
}



const makeWordTree = (wordArray) => {
  const root = {};
  for(const word of wordArray){
    if(word.length < 4 || word.includes('-') || word.includes("'")){
      continue;
    }
    let node = root;
    for (const letter of word) {
      if(node.end !== undefined){
        break;
      }
      if(!node[letter]){
        node[letter] = {}
      }
      node=node[letter];
    }
    if(node.end === undefined){
        node.end = word.length % 2 === 0 ? 'even' : 'odd';
    }
  }
  return root;
};


const writeWordTreeFile = (filePath) => {
  const wordTree = makeWordTree(wordArray);
  fs.writeFileSync(filePath, JSON.stringify(wordTree, null, 2));
  console.log(`wrote word Tree to ${filePath}`)
}
//writeWordTreeFile('wordtree.json');

const writeSolutionsFile = (filePath) => {
  const solutions = pruneTree(wordTree);
  ;
  fs.writeFileSync(filePath, JSON.stringify(solutions, null, 2));
}
// writeSolutionsFile('ghostSolutions.json');


////////////////////////////////////////////////////////

module.exports = {
  getNextMove
}