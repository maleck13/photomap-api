var config = require(process.env.PHOTOMAP_CONF);

console.log("conf set up from " + process.env.PHOTOMAP_CONF);

module.exports = function (){

  return{
    "getMongoUrl": function (){
      return config.mongourl;
    },
    "getRabbitUrl": function (){
      return config.rabbiturl;
    }

  }


}
