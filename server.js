var express = require('express');
var app = express();
app.use(function (req,res,next){
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Origin","*");
  res.header("Cache-Control","no-cache");
  next();
});
var conf = require('./config/conf')();

var rabbit = require('rabbit.js').createContext(conf.getRabbitUrl());

rabbit.on('ready', function() {
  console.log("rabbitmq ready");
  var pub = context.socket('PUSH');
  pub.connect("pics");
  app.rabbit = pub;
});

rabbit.on('error',console.error);

require('./model/db')();
require('./router')(app);


app.listen(8080);
