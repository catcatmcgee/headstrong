const axios = require('axios');
const { WEBSTER_TOKEN } = process.env;

const okayPartsOfSpeech = [
  "verb",
  "noun",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "interjection",
  "pronoun",
  "adverb or adjective"
]

const processDefinition = (definition, word) => {
  //no definition
  if (!definition || !definition.shortdef || definition.hwi.hw !== word){
    return {invalid: 'no such word'}
  //make sure the word is viable
  } else if (!(okayPartsOfSpeech.includes(definition.fl))) {
    return {invalid: definition.fl}
  //return the word
  } else {
    return {[word]: definition.shortdef[0]}
  }
}

const getChallengeResults = async (word) => {
  try {
    const {data} = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${WEBSTER_TOKEN}`);
    console.log('first definition, word', data[0], 'word', word)
    const lookupResults = processDefinition(data[0], word);
    console.log('wordLookupResults', lookupResults)
    return lookupResults;
  } catch (err){
    console.log("webster api error:", err);
  }
}

module.exports = {
  getChallengeResults
}