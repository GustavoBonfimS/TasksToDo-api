const mssql = require('mssql');

const config = {
  user: 'sa',
  password: 'toledo',
  server: '127.0.0.1',
  database: 'taskstodo',
};

mssql.connect(config, err => {
  if (err) throw new Error(err);
});

exports.query = sql => {
  return new Promise((resolve, reject) => {
    const request = new mssql.Request();
    request.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.recordset);
      }
    });
  });
};
