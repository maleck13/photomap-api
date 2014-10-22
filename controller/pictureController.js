var PictureModel = require('../model/picture');
var async = require('async');

module.exports = function (){


  return{
    "getPicsByLocation" : function (req,res){
      var ret;
      var pic;
      async.series([
        function findNearBy(callback){
          if(! req.params.lon || ! req.params.lon) return callback({"error":"no lat lon", "code":400});
          if(! req.params.from || ! req.params.to) return callback({"error":"no from to dates ", code:400});
          pic = new PictureModel();
          pic.findNear([req.params.lon,req.params.lat],req.params.from,req.params.to,function (err, list){
            if(err) return callback(err);
            ret = list;
            callback();
          });
        }
      ], function complete(err){
        if(err) ret = {"error":"error finding pictures","code":err.code || 500, err:err.message || err};
        res.json(ret)
      });
    },

    "getYearRange" : function (req,res){
      async.series([
        function getRange(callback){
          var pic = new PictureModel();
          pic.yearRange(req.params.user,callback);
        }
      ],function done(err,ok){
        var ret;
        if(err) {
          ret = {"error":"error finding range","code":err.code || 500, err:err.message || err};
        }else{
          ret = ok[0];
        }
        res.json(ret);

      });
    }
  }
};
