const axios = require('axios');
const { Countdown, getAllMessages, addMessage } = require('../db/index');
const { OPENAI_TOKEN } = process.env;


const createMessage = async (gameUpdate, user) => {
  console.log('user', user)
  try {
    const chatMessages = await getAllMessages()
    const messageText = chatMessages.map(message => message.text);
    console.log('messageText', messageText);
    const {text: story} = await Countdown.findOne({ where: { username: user } });
    console.log('story', story);
    // const initialPrompt = `You are a mean internet bully who is playing an online
    //   word game. I'm going to describe the game and you're going to respond with
    //   messages to your opponent. Include insults and find creative ways to bring up your opponent's
    //   fear of this story: ${story}. Most messages should be about 5-7 words,
    //   and messages should not exceed 20 words.`
    // const messages = [
    //   { role: 'system', content: initialPrompt },
    //   { role: 'user', content: 'You just got matched with your opponent' }
    // ].concat(chatMessages, gameUpdate);
  //   console.log(messages);
  //   const {data} = axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
  //     model: 'text-davinci-002',
  //     messages: messages,
  //     temperature: 1.3,
  //     max_tokens: 100
  //   }, {
  //     headers: {
  //       'Authorization': `Bearer ${OPENAI_TOKEN}`,
  //       'Content-Type': 'application/json'
  //     }
  //   })

  //   const reply = data.choices[0].message.content
  //   addMessage('opponent', reply);
  //   console.log(`${reply}\nSaved to database`)
  }catch (error) {
    console.error('Error:', error);
  }

}

module.exports = {
  createMessage
}