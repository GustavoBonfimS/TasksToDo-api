const router = require('express').Router();
const mssql = require('../database/mssql');

router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM projects';
  const result = await mssql.query(sql);
  return res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
  const sql = `SELECT * FROM projects WHERE idproject = '${req.params.id}'`;
  const result = await mssql.query(sql);
  if (!result) {
    return res.status(500).json({
      error: 'project not found',
    });
  }
  return res.status(200).json(result[0]);
});

router.get('/user/:id', async (req, res) => {
  let sql = `SELECT * FROM projects WHERE iduser = '${req.params.id}'`;
  const result = await mssql.query(sql);
  if (!result) {
    return res.status(500).json({
      error: 'project not found',
    });
  }
  const newResult = await Promise.all(
    result.map(async proj => {
      sql = `SELECT * FROM tasks WHERE idproject = ${proj.idproject}`;
      const tasks = await mssql.query(sql);
      const arrProj = proj;
      arrProj.tasks = tasks;
      return arrProj;
    }),
  );
  return res.status(200).json(newResult);
});

router.post('/', async (req, res) => {
  let sql = `INSERT INTO projects(iduser, name) VALUES('${req.body.iduser}', '${req.body.name}')`;
  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM projects WHERE iduser = '${req.body.iduser}'`;
      const result = await mssql.query(sql);
      const newResult = await Promise.all(
        result.map(async proj => {
          sql = `SELECT * FROM tasks WHERE idproject = ${proj.idproject}`;
          const tasks = await mssql.query(sql);
          const arrProj = proj;
          arrProj.tasks = tasks;
          return arrProj;
        }),
      );
      return res.status(201).json(newResult);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err,
      });
    });
});

router.put('/:id', async (req, res) => {
  let sql = `UPDATE projects SET iduser = '${req.body.iduser}', name = '${req.body.name}' 
  WHERE idproject = '${req.params.id}'`;

  await mssql
    .query(sql)
    .then(async () => {
      sql = `SELECT * FROM projects WHERE iduser = '${req.body.iduser}'`;
      const result = await mssql.query(sql);
      if (!result) {
        return res.status(500).json({
          error: 'project not found',
        });
      }
      return res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  let sql = `SELECT * from tasks WHERE idproject = ${req.params.id}`;
  const proj = await mssql.query(sql);
  if (proj.length >= 0) {
    sql = `DELETE FROM tasks WHERE idproject = ${req.params.id}`;
    await mssql.query(sql);
  }

  sql = `DELETE FROM projects WHERE idproject = ${req.params.id}`;
  await mssql.query(sql).then(() => {
    return res.status(200).json({
      message: 'deleted succesful',
    });
  });
});

module.exports = router;
