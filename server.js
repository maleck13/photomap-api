var express = require('express');
var app = express();
var conf = require('./config/conf')()
var db = require('./model/db')();
var router = require('./router')(app);


app.listen(8080);