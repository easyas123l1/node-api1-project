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
  } else {
    db.insert(data)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log('error on POST /users', error);
      res.status(500).json({ errorMessage: 'There was an error while saving the user to the database' })
    })
  }
})

// retrieve users
server.get('/api/users', (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    console.log('error on GET /users', error);
    res.status(500).json({ errorMessage: 'The users information could not be retrieved.' })
  })
})

// retrieve user by id
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
    }

  })
  .catch(error => {
    console.log('error on GET /users/:id', error);
    res.status(500).json({ errorMessage: 'The user information could not be retrieved.' })
  })
})

// delete user by id
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
    }
  })
  .catch(error => {
    console.log('error on DELETE /users/:id', error)
    res.status(500).json({ errorMessage: 'The user could not be removed.' })
    })
  })

// update user by id
server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (!data.name || !data.bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
  } else {

  db.update(id, data)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
    }
  })
  .catch(error => {
    console.log('error on UPDATE /users/:id', error)
    res.status(500).json({ errorMessage: 'The user information could not be modified.' })
  })
  }
})


const port = 4000;
server.listen(port, () => console.log(`\n ** API running on port ${port} ** \n `))