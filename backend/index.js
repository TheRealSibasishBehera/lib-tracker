const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const gitUsers = require("./routes/github");
const express = require('express');
const cors = require("cors");

const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/libtracker')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(cors())
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use("/api/github", gitUsers);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));