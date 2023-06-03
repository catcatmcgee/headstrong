const axios = require('axios');
const { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } = require('openai');
const { OPENAI_TOKEN } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_TOKEN,
});

const openai = new OpenAIApi(configuration);

openai.createChatCompletion(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": `You are a brutal internet troll who is playing an online word game. I'm going to describe the game and you're going to respond with messages to your opponent. Include insults and find ways to bring up their fear of ${event}. Most messages should be about 5-7 words, and messages should not exceed 20 words.`},
    {"role": "user", "content": "You just got matched with your opponent"}
  ]
)

const getStory = async (event, task, stressors) => {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `I'm worried about an upcoming ${event} where I have to ${task}. It's stressful for this reason: ${stressors}. Please write me a story in second person perspective that describes a worst-case scenario for how this event could play out. The story should be roughly 50 words in length.`,
    max_tokens: 200,
    temperature: 1.30,
  });
  return response.data;
}

module.exports = {
  getStory
}