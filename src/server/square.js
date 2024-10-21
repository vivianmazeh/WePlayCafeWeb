const { ApiError, Client, Environment } = require('square');

const { isProduction, SQUARE_ACCESS_TOKEN } = require('./config');



// Use the accessToken for making API requests

const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox' ? Environment.Sandbox : Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

module.exports = { ApiError, client };
