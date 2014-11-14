var confLoc = process.env.PHOTOMAP_CONF || "/etc/photomap/conf.json"
var config = require(confLoc);

console.log("conf set up from ", confLoc);

module.exports = function (){

  return{
    "getMongoUrl": function (){
      return config.mongourl;
    },
    "getRabbitUrl": function (){
      return config.rabbiturl;
    },
    "getPicDir": function (){
      return config.picdir;
    }

  }


}
