'use strict';
require('dotenv').config();
const cors = require('cors');
const verifyUser = require('./auth/authorizer')
const express = require('express');
const app = express();

//middleware
app.use(cors({'Access-Control-Allow-Origin': process.env.AUTHORIZED_URL}));
app.use(express.json());
app.use(verifyUser);
////

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

/*********************************ROUTES*****************************************/
const userHandler = require('./route_handlers/UserRoutes');
app.use('/user', userHandler);

const blackJackHandler = require('./route_handlers/BlackJackRoutes');
app.use('/blackjack', blackJackHandler);

/*******************************END ROUTES***************************************/

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

