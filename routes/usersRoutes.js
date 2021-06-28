const router = require('express').Router();
const mssql = require('../database/mssql');

// / posts = create
// /get = list all
// / get/id = get specific
// put/id = edit specific
// delete/id = delete specific

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM users';
  const result = await mssql.query(sql);
  return res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
  const sql = `SELECT * FROM users WHERE iduser = '${req.params.id}'`;
  const result = await mssql.query(sql);
  if (!result) {
    return res.status(500).json({
      error: 'user not found',
    });
  }
  return res.status(200).json(result[0]);
});

router.post('/', async (req, res) => {
  let sql = `INSERT INTO users(username, password) VALUES('${req.body.username}', '${req.body.password}')`;
  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
      const result = await mssql.query(sql);
      return res.status(201).json({
        auth: true,
        user: result[0],
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        message: err.message,
      });
    });
});

router.post('/login', async (req, res) => {
  const sql = `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
  const result = await mssql.query(sql);
  if (!result[0]) {
    return res.status(200).json({
      auth: false,
    });
  }

  return res.status(200).json({
    auth: true,
    user: result[0],
  });
});

router.put('/:username', async (req, res) => {
  let sql = `SELECT * FROM users WHERE username = '${req.params.username}'`;
  const verifyValid = await mssql.query(sql);
  if (!verifyValid[0]) {
    return res.status(200).json({
      auth: false,
      message: 'user not found',
    });
  }

  sql = `UPDATE users SET username = '${req.body.username}', password = '${req.body.password}' 
  WHERE username = '${req.params.username}'`;

  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
      const result = await mssql.query(sql);
      if (!result) {
        return res.status(500).json({
          error: 'user not found',
        });
      }
      return res.status(200).json({
        auth: true,
        user: result[0],
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  const sql = `DELETE FROM users WHERE iduser = ${req.params.id}`;
  await mssql
    .query(sql)
    .then(() => {
      return res.status(200).json({
        message: 'deleted succesful',
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    });
});

module.exports = router;
