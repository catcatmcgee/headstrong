const axios = require('axios');
const { Countdown, getAllMessages, addMessage } = require('../db/index');
const fs = require('fs');
const { OPENAI_TOKEN } = process.env;
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: OPENAI_TOKEN,
});

const openai = new OpenAIApi(configuration);

const usernameArray = fs.readFileSync('usernames.js', 'utf8').split('\n');

const username = usernameArray[Math.floor(Math.random()*usernameArray.length)]

const getPrompt = async (gameUpdate, user)=>{
  const { event, stressors } = await Countdown.findOne({ where: { username: user } });
  console.log(gameUpdate);

  const initPrompt =  `${username} is a bully who is playing a 2 player word game online where you take turns spelling a word fragment and force your opponent to spell a complete word. ${username} responds to descriptions of the game with individual chat messages to his opponent. Include insults or occasionally bring up your opponent's fear of this upcoming event: "${event}" that they are stressed about for this reason: "${stressors}". You: You have been matched with your opponent. ${username}: you so aren't ready for this game. hopeless You: Your opponent just completed a word, losing them a life. ${username}: wooooow already? Hope the ${event} goes better for you than this does.`
  const newUpdate = "You: " + (gameUpdate === 'paired ' ?
  'you just got matched with your opponent' : gameUpdate === 'invalid' ?
  'your opponent just submitted and invalid word and lost a life' : gameUpdate === 'user challenge failed' ?
  'your opponent just challenged the word you made, but you had a correct word, so they lost a life' : gameUpdate === 'user out of time' ?
  'you challenged your opponent and they ran out of time to submit a valid word' : gameUpdate === 'complete' ?
  'your opponent completed a word, which is the main thing you have to avoid doing, so they lost a life' : gameUpdate === 'user lost' ?
  'your opponent is out of lives so they lost the whole game. haha!' : gameUpdate
  )
  return initPrompt + newUpdate;
}

function removeUsernameFromText(inputString) {
  var colonIndex = inputString.indexOf(': ');
  if (colonIndex === -1) {return inputString;}
  return inputString.slice(colonIndex + 2);
}

const createMessage = async (gameUpdate, user) => {
  try{
    const prompt = await getPrompt(gameUpdate, user)
    const {data} = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 50
    });
    const reply = data.choices[0].text
    const messageText = removeUsernameFromText(reply)
    console.log(messageText);
    addMessage(`${username}`, messageText);
    return;
    } catch (error) {
      console.log(error)
    // DETAILED ERROR HANDLING TO GET MORE INFO IF YOU NEED IT
    // if (error.response) {
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   console.log(error.response.data);
    //   console.log(error.response.status);
    //   console.log(error.response.headers);
    // } else if (error.request) {
    //   // The request was made but no response was received
    //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //   // http.ClientRequest in node.js
    //   console.log(error.request);
    // } else {
    //   // Something happened in setting up the request that triggered an Error
    //   console.log('Error', error.message);
    // }
    // console.log(error.config);
  }
}

module.exports = {
  createMessage
}