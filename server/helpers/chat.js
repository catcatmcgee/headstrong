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

const getPrompt = async (gameUpdate, user, lives)=>{
  console.log(lives, gameUpdate)
  if (lives === 5) {
    return `${username} is a bully who is playing a 2 player word game online where you take turns spelling a word fragment and force your opponent to spell a complete word. ${username} responds with short chat messages to his opponent in the first person. Insult your opponent relentlessly.`
  } else if (lives === 4) {
    return `${username} is a bully who is playing a 2 player word game online where you take turns spelling a word fragment and force your opponent to spell a complete word. ${username} responds with short chat messages to his opponent in the first person. Insults your opponent relentlessly. Accuse them of having an infiriority complex and being incredibly stupid. Make fun of them for having lost a life already.`
  } else if ( lives === 0) {
    return `${username} is a bully who is playing a 2 player word game online where you take turns spelling a word fragment and force your opponent to spell a complete word. ${username} responds with short chat messages to his opponent in the first person. Insults your opponent relentlessly. Accuse them of having an infiriority complex and being incredibly stupid. Make fun of them for having lost the game. tell them theyre the stupidest person ever and they'll never make their dad proud.`
  } else {
    const { event, stressors } = await Countdown.findOne({ where: { username: user } });
    const initPrompt =  `${username} is a bully who is playing a 2 player word game online where you take turns spelling a word fragment and force your opponent to spell a complete word. ${username} responds with short chat messages to his opponent in the first person. Include insults or Accuse them of having an infiriority complex and being incredibly stupid or make fun of them for haveing ${5- lives} lives or occasionally bring up your opponent's fear of this upcoming event: "${event}" that they are stressed about for this reason: "${stressors}". You: You have been matched with your opponent. ${username}: you so aren't ready for this game. hopeless You: Your opponent just completed a word, losing them a life. ${username}: wooooow already? Hope the ${event} goes better for you than this does.`
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
}

function removeUsernameFromText(inputString) {
  const colonIndex = inputString.indexOf(': ');
  if (colonIndex === -1) {return inputString;}
  return inputString.slice(colonIndex + 2);
}

const createMessage = async (gameUpdate, user, lives) => {
  try{
    const prompt = await getPrompt(gameUpdate, user, lives)
    console.log('PROMPT:', prompt)
    const {data} = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 100
    });
    const reply = data.choices[0].text
    console.log('unedited reply text', reply)
    const messageText = removeUsernameFromText(reply)
    console.log('edited reply text', messageText);
    addMessage(`${username}`, messageText);
    return;
    } catch (error) {
    //console.log(error)
    //DETAILED ERROR HANDLING TO GET MORE INFO IF YOU NEED IT
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
}

module.exports = {
  createMessage
}