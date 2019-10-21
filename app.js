const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

const UserRoutes = require('./api/routes/router.user');


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// DataBase Connection
mongoose.connect('mongodb://localhost:27017/token', { 
  useNewUrlParser: true 

}).then(() => console.log('DataBase connection successful'))
  .catch((err) => console.log(err))


// api
app.use('/api/user', UserRoutes);


// Localhost
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log( `Server is Running on PORT: ${PORT}`));