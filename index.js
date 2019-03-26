const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

const db = knex({
  client: 'sqlite',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
});

server.use(express.json());
server.use(helmet());

// ============== GET ROUTES ============= //

server.get('/api/zoos', async (req, res) => {
  try {
    const animalsInZoo = await db('zoos');
    res.status(200).json(animalsInZoo);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const specificAnimalInZoo = await db('zoos').where({ id: req.params.id });
    if (specificAnimalInZoo.length >= 1) {
      res.status(200).json(specificAnimalInZoo[0]);
    } else {
      res.status(400).json({ message: 'Object with provided id is not in the database' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ============== POST ROUTES ============= //
server.post('/api/zoos', async (req, res) => {
  try {
    if (req.body.name) {
      const newAnimalInZooArray = await db('zoos').insert({ name: req.body.name });
      const newAnimalInZooObject = await db('zoos').where({ id: newAnimalInZooArray[0] });
      res.status(200).json(newAnimalInZooObject[0]);
    } else {
      res.status(400).json({ message: 'Please make sure that you are sending request in following format [POST] { name: nameOfAnimalInZoo }' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ============== DELETE ROUTES ============= //

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const isDeletedAnimalTrue = await db('zoos')
      .where({ id: req.params.id })
      .del();
    if (isDeletedAnimalTrue) {
      res.status(200).json({ message: 'Animal with provided id was deleted' });
    } else {
      res.status(400).json({ message: 'Animal with provided id does not exist' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
knex('users')
  .where({ id: 135 })
  .update({ email: 'hi@example.com' });

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
