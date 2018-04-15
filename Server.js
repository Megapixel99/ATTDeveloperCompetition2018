//This script is written to be used in conjunction with MongoDB, Function.js, and Router.js
//Written for the ATT App Developer Competition
//Written by Seth C. Wheeler
const express = require('./node_modules/express'); //Getting Expresss
const app = express();
const http = require('http');
var Router = require("./Router.js"); //Getting Router.js
app.use(Router); //Using Router.js
var httpServer = http.createServer(app);
httpServer.listen(3000);
