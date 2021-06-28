const router = require('express').Router();
const mssql = require('../database/mssql');

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM tasks';
  const result = await mssql.query(sql);
  return res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
  const sql = `SELECT * FROM tasks WHERE idtask = '${req.params.id}'`;
  const result = await mssql.query(sql);
  if (!result) {
    return res.status(500).json({
      error: 'task not found',
    });
  }
  return res.status(200).json(result[0]);
});

router.get('/project/:id', async (req, res) => {
  const sql = `SELECT * FROM tasks WHERE idproject = '${req.params.id}'`;
  const result = await mssql.query(sql);
  if (!result) {
    return res.status(500).json({
      error: 'task not found',
    });
  }
  return res.status(200).json(result);
});

router.post('/', async (req, res) => {
  let sql = `INSERT INTO tasks(idproject, description, finished, created_at) VALUES('${req.body.idproject}', '${req.body.description}',
  '${req.body.finished}', '${req.body.created_at}')`;
  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM tasks WHERE description = '${req.body.description}'`;
      const result = await mssql.query(sql);
      return res.status(201).json(result[0]);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        message: err.message,
      });
    });
});

router.put('/:id', async (req, res) => {
  let sql = `UPDATE tasks SET description = '${req.body.description}', finished = '${req.body.finished}' 
  WHERE idtask = '${req.params.id}'`;

  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM tasks WHERE description = '${req.body.description}'`;
      const result = await mssql.query(sql);
      if (!result) {
        return res.status(500).json({
          error: 'task not found',
        });
      }
      return res.status(200).json(result[0]);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    });
});

router.put('/finished/:id', async (req, res) => {
  let sql = `UPDATE tasks SET finished = '${req.body.finished}' 
  WHERE idtask = '${req.params.id}'`;

  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM tasks WHERE idtask = '${req.params.id}'`;
      const result = await mssql.query(sql);
      if (!result) {
        return res.status(500).json({
          error: 'task not found',
        });
      }
      return res.status(200).json(result[0]);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  const sql = `DELETE FROM tasks WHERE idtask = ${req.params.id}`;
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
