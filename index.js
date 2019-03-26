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
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ============== POST ROUTES ============= //
server.post('/api/zoos', async (req, res) => {
  try {
    const newZoo = await db('zoos').insert({ name: req.body.name });
    const zooObject = await db('zoos').where({ id: newZoo[0] });
    res.status(200).json(zooObject[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
