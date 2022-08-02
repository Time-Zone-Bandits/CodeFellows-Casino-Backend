'use strict';
require('dotenv').config();
const cors = require('cors');
const verifyUser = require('./auth/authorizer')
const express = require('express');
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(verifyUser);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

/*********************************ROUTES*****************************************/
const userHandler = require('./route_handlers/UserRoutes');
app.user('/user', userHandler);

const blackJackHandler = require('./route_handlers/BlackJackRoutes');
app.use('/blackjack', blackJackHandler);

/*******************************END ROUTES***************************************/

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

