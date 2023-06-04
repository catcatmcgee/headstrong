const { Router } = require('express');
const Messages = Router();
const { getAllMessages, addMessage, deleteMessage, deleteAllMessages, editMessage } = require('../db');
const { createMessage } = require('../helpers/chat');

Messages.get('/', (req, res) => {
  return getAllMessages()
    .then((data) => res.status(200).send(data))
    .catch((err) => console.warn(err));
});

Messages.post('/update', (req, res) => {
  const { Headstrong: user } = req.cookies;
  return createMessage(req.body, user)
    .then(() => res.status(201).send(null))
    .catch((err) => console.warn(err));
});

Messages.post('/', (req, res) => {
  return addMessage(req.body)
    .then(() => res.status(201).send(null))
    .catch((err) => console.warn(err));
});

Messages.delete('/:id', (req, res) => {
  return deleteMessage(req.params)
    .then(() => res.status(200).send(null))
    .catch((err) => console.warn(err));
});

Messages.delete('/all', (req, res) => {
  return deleteAllMessages(req.params)
    .then(() => res.status(200).send(null))
    .catch((err) => console.warn(err));
});

Messages.put('/', (req, res) => {
  console.info(req.body);
  return editMessage(req.body)
    .then(() => res.status(200).send(null))
    .catch((err) => console.log(err));
});

module.exports = {
  Messages,
};
