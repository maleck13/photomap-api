var conf  = require('../config/conf')();
var mongoose = require('mongoose');


module.exports = function (){

  mongoose.connect(conf.getMongoUrl());
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

}
