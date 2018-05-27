const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect To Database
mongoose.connect(config.database, {
    // The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it
    // Este error me lo estaba mostrando cuando iniciaba el servidor pq la linea de abajo estaba sin comentar
    // useMongoClient: true 
});

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error '+err);
});

const app = express();

const users = require('./routes/users');
const products = require('./routes/products');
const cart = require('./routes/shoppingcar');

// Port number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parse Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/products', products);
app.use('/cart', cart);

// Index route
app.get('/', (req, res) => {
    res.send('invalid endpoint');
});

// Start serve
app.listen(port, () => {
    console.log('server started on port: '+port);
});
