const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-handler');
require('dotenv').config();

const routes = require('./routes/index');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(routes);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});