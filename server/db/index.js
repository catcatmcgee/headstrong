const Sequelize = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false
});

sequelize.authenticate()
  .then(() => console.info('Connected to the Database'))
  .catch((err) => console.warn('Cannot connect to db:\n', err));


const Countdown = sequelize.define('countdowns', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
  },
  event: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.STRING,
  },
  task: {
    type: Sequelize.STRING,
  },
  stressors: {
    type: Sequelize.STRING,
  },
  story: {
    type: Sequelize.TEXT('long'),
  }
});
Countdown.sync({alter: true});

const addCountdown = async(username, event, date, task, stressors, story) => {
  try {
    const newCountdown = await Countdown.create({
      username,
      event,
      date,
      task,
      stressors,
      story
    });
    return newCountdown.save();
  } catch (err) {
    console.error('Failed to SAVE countdown to db:', err);
  }
};

const Message = sequelize.define('messages', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.STRING,
  },
  text: {
    type: Sequelize.STRING,
  }
});
Countdown.sync({alter: true});

const addMessage = async(username, date, text) => {
  Message.create({
    username,
    date,
    text
  })
  .then(() => {
    console.log('Message saved');
  })
  .catch((error) => {
    console.error('Unable to save Message:', error);
  })
};

const getAllMessages = (user) => {
  return Message.findAll();
};

const deleteMessage = (body) => {
  const { id } = body;
  Message.destroy({
    where: {
      id: id
    }
  })
  .then(() => {
    console.log('Message has been deleted');
  })
  .catch((error) => {
    console.error('Unable to delete Message:', error);
  });
};

const deleteAllMessages = () => {
  Message.destroy({
    where: {},
    truncate: true
  })
  .then(() => {
    console.log('All entries have been deleted');
  })
  .catch((error) => {
    console.error('Unable to delete all Messages:', error);
  });
};

const editMessage = (body) => {
  const { id, text } = body;
  Message.update({
    text: text
  },
  {
    where: {
      id: id
    }
  })
  .then(() => {
    console.log('Message updated');
  })
  .catch((error) => {
    console.error('Unable to update Message:', error);
  });
};

const Entries = sequelize.define('entries', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  username: {
    type: Sequelize.STRING(50),
    allowNull: false
  },

  title: {
    type: Sequelize.STRING(100),
    allowNull: false
  },

  blog: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },

  journalImage: {
    type: Sequelize.STRING(10000)
  },

  temp: {
    type: Sequelize.STRING
  },

  weatherDescription: {
    type: Sequelize.STRING
  },

  mood: {
    type: Sequelize.STRING
  }

});
Entries.sync();

const getAllJournals = (user) => {
  if (user) {
    return Entries.findAll({
      where: {
        username: user
      }
    });
  } else {
    return Entries.findAll();
  }
};

const deleteJournal = (body) => {
  const { id } = body;
  return Entries.destroy({
    where: {
      id: id
    }
  });
};

const addJournals = async(body, user) => {

  const { mood, title, blog, journalImage, temp, weatherDescription } = body;

  const newEntry = await Entries.create({
    username: user,
    title: title,
    blog: blog,
    journalImage: journalImage,
    temp: temp,
    weatherDescription: weatherDescription,
    mood: mood
  });

  return newEntry.save();
};

const updateJournal = (body) => {
  const { username, title, blog, id, journalImage } = body;
  //first object is what you want to change
  return Entries.update({
    username: username,
    blog: blog,
    title: title,
    journalImage: journalImage,
  },
  {
    where: {
      id: id
    }
  });

};

module.exports = {
  getAllJournals,
  addJournals,
  deleteJournal,
  updateJournal,
  Entries,
  addCountdown,
  Countdown,
  addMessage,
  getAllMessages,
  deleteMessage,
  deleteAllMessages,
  editMessage
};
