var config = require('../config/conf')();

var context;

var pub;

module.exports = function (){

  if(! context){
    context = require('rabbit.js').createContext(conf.getRabbitUrl());
  }
  return context;


};
