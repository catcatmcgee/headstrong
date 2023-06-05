const { Router } = require('express');
const Messages = Router();
const { getMessage, getAllMessages, addMessage, deleteMessage, deleteAllMessages, editMessage } = require('../db');
const { createMessage } = require('../helpers/chat');

Messages.get('/', (req, res) => {
  return getAllMessages()
    .then((data) => res.status(200).send(data))
    .catch((err) => console.warn(err));
});

Messages.post('/update', (req, res) => {
  const { Headstrong: user } = req.cookies;
  const { update, userLives } = req.body
  console.log(userLives);
  return createMessage(update, user, userLives)
    .then(() => res.status(201).send(null))
    .catch((err) => console.warn(err));
});

Messages.post('/', (req, res) => {
  const { body: { text } } = req
  console.log(text);
  return addMessage('You', text)
    .then(() => res.status(201).send(null))
    .catch((err) => console.warn(err));
});

Messages.delete('/all', (req, res) => {
  try {
    deleteAllMessages()
    res.status(200).send(null)
  } catch (err) {
    console.warn(err)
  }
});

Messages.delete('/:id', async (req, res) => {
  const {params: {id}} = req;
  console.log('id', id);
  try {
    const message = await getMessage(id)
    if (!message) {
      res.status(404).send('Message not found');
    } else {
      deleteMessage(id)
      res.status(200).send(null)
    }
  } catch (err) {
    console.warn(err)
  }
});

Messages.put('/', async (req, res) => {
  console.info('req.body', req.body);
  try {
    const message = await getMessage(req.body.id);
    if(!message) {
      res.status(404).send('Message not found');
    } else {
      editMessage(req.body)
      res.status(200).send(null)
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  Messages,
};
