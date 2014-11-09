var express = require('express');
var app = express();
app.use( function(req, res, next) {
  console.log("cors");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var conf = require('./config/conf')();

var rabbit = require('rabbit.js').createContext(conf.getRabbitUrl());
var db = require('./model/db')();
var router = require('./router');

rabbit.on('ready', function() {
  console.log("rabbitmq ready");
  var pub = rabbit.socket('PUSH');
  var sub = rabbit.socket("WORKER",{"routing":"direct","persistent":true});
  console.log("rabbitmq socket");
  pub.connect("pics");
  console.log("rabbitmq pub");
  app.rabbitPub = pub;
  app.rabbitSub = sub;
  console.log("rabbitmq pub");
  router(app);
  console.log("router");
  app.listen(process.env.PORT || 8080);
});

rabbit.on('error',console.error);




