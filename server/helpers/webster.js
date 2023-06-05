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
  "adverb or adjective",
]

const processDefinition = (definition, word) => {
  //no definition
  if (!definition[0] || !definition[0].shortdef || !definition[0].meta.stems.includes(word)){
    return {invalid: 'no such word'}
  //make sure the word is viable
  } else if (definition[0].fl && !(okayPartsOfSpeech.includes(definition[0].fl))) {
    return {invalid: definition[0].fl}
  //return the word
  } else {
    return definition[0].shortdef[0] ? {[word]: definition[0].shortdef[0]} : {[word]: definition[1].shortdef[0]}
  }
}

const getChallengeResults = async (word) => {
  try {
    const {data} = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${WEBSTER_TOKEN}`);
    // console.log('first definition', data[0], 'word', word)
    const lookupResults = processDefinition(data, word);
    console.log('wordLookupResults', word, lookupResults)
    return lookupResults;
  } catch (err){
    console.log("webster api error:", err);
  }
}

module.exports = {
  getChallengeResults
}