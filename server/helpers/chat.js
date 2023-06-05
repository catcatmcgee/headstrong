const axios = require('axios');
const { Countdown, getAllMessages, addMessage } = require('../db/index');
const { OPENAI_TOKEN } = process.env;


const createMessage = async (gameUpdate, user) => {
  console.log('user', user)
  try {
    const chatMessages = await getAllMessages()
    const pastMessages = chatMessages.map(({username, text}) => {
      return {
        role: (username === 'You' ? 'user' : 'assistant'),
        content: (username ==='You' ?
          `your opponent just wrote this in chat: "${text}"` :
          text)
      }
    });

    const newUpdate = {
      roll: 'user',
      content: (
        gameUpdate === 'invalid' ?
        'your opponent just submitted and invalid word and lost a life' : gameUpdate === 'user challenge failed' ?
        'your opponent just challenged the word you made, but you had a correct word, so they lost a life' : gameUpdate === 'user out of time' ?
        'you challenged your opponent and they ran out of time to submit a valid word' : gameUpdate === 'complete' ?
        'your opponent completed a word, which is the main thing you have to avoid doing, so they lost a life' : gameUpdate === 'user lost' ?
        'your opponent is out of lives so they lost the whole game. haha!' : 'you think the your opponent is taking too long'
      )
    }

    const { event, task, stressors } = await Countdown.findOne({ where: { username: user } });
    
    const initialPrompt = `You are an internet bully who is playing an online word game against another user. I'm going to describe the game and you're going to respond with chat messages to your opponent. Include insults. Find creative ways to bring up your opponent's fear of this upcoming event: "${event}" where they have to do: "${task}" that they are stressed about for this reason: "${stressors}" and that they think will go the worst possible way for them. Most messages should be about 5-7 words,and messages should not exceed 20 words.`
    const messages = [
      { role: 'system', content: initialPrompt },
      { role: 'user', content: 'You just got matched with your opponent' }
      ].concat(pastMessages, newUpdate);

    const {data} = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      model: 'text-davinci-002',
      messages: messages,
      temperature: 1.3,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })  .catch(function (error) {
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
    });
    //console.log(data, 'data');
    //const reply = data.choices[0].message.content
    addMessage('PikachuTrainer10', reply);
    console.log(`${reply}\nSaved to database`)
  }catch (error) {
    //console.error('Error:', error);
  }

}

module.exports = {
  createMessage
}