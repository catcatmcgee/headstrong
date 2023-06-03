const { Router } = require('express');
const Stories = Router();
const { getStory } = require('../helpers/stories');
const { Countdown, addCountdown } = require('../db/index');

Stories.get('/', async (req, res) => {
  const { Headstrong: user } = req.cookies;
  try {
    const countdown = await Countdown.findOne({ where: { username: user }});
    if (!countdown) {
      throw countdown;
    }
    res.status(200).send(countdown);
  } catch (err) {
    console.error('Failed to GET story from db:', err);
    res.sendStatus(500);
  }
})

Stories.post('/', async (req, res) => {
  const { event, date, task, stressors } = req.body;
  const { Headstrong: user } = req.cookies;
  try {
    const response = await getStory(event, task, stressors);
    const { text: story } = response.choices[0];
    const existingStory = await Countdown.findOne({ where: { username: user } });
    if (existingStory) {
      await existingStory.update({ event, date, task, stressors, story });
    } else {
      await addCountdown(user, event, date, task, stressors, story);
    }
    res.status(201).send(response);
  } catch (err) {
    console.error('Failed to POST text to API:', err);
    res.sendStatus(500);
  }
})

module.exports = {
  Stories,
}