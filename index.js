const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json())

server.get('/', (req, res) => {
  res.send({ api: 'ALIVE!' })
})

// create a user
server.post('/api/users', (req, res) => {
  const data = req.body;
  if (!data.name || !data.bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
  }
  db.add(data)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    console.log('error on POST /users', error);
    res.status(500).json({ errorMessage: 'error getting list of users from database' })
  })
})

const port = 4000;
server.listen(port, () => console.log(`\n ** API running on port ${port} ** \n `))