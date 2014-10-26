var mongoose = require('mongoose');
var PictureSchema = mongoose.Schema({
  name: String,
  path : String,
  thumb: String,
  lonlat: {type: [Number], index:'2d'},
  time : Date,
  timestamp : Number,
  user:String,
  year: String
});

PictureSchema.methods.findNear = function(geoPoints,from,to,cb) {

  return this.model('Picture').find({lonlat: { $nearSphere: geoPoints, $maxDistance: 0.02} }).where('timestamp').gte(from).lte(to).exec(cb);

};

PictureSchema.methods.yearRange = function(user,cb){
  return this.model('Picture').distinct('year',{"user":user}).exec(cb);
};


PictureSchema.methods.findInTimeRange = function(from,to,cb){
  console.log("from :", from, " to : ",to);
return this.model('Picture').find({}).where('timestamp').gte(from).lte(to).exec(cb);
};
//PictureSchema.methods.findUpdate = function (cb){
//  var self = this;
//  this.model('Picture').find({}, function (err, res){
//    var count=0;
//    res.forEach(function (p){
//      var pj = JSON.parse(JSON.stringify(p));
//      //p.user = "maleck13";
//      if(pj.time) {
//        p.year = pj.time.toString().substr(0, 4);
//        p.save(function (err, it) {
//          count++;
//          console.log("save ", err, it._id, "count ", count);
//        });
//      }
//    });
//    cb();
//  });
//
//};


module.exports = mongoose.model('Picture', PictureSchema);

