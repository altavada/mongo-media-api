const { connect, connection } = require('mongoose');

connect('mongodb://localhost/thoughtsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
