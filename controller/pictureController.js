var PictureModel = require('../model/picture');
var async = require('async');
var fs = require('fs');
var path = require('path');

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

    "getPicsFromDateRange" : function (req,res){
      var from = req.params.from;
      var to = req.params.to;
      var pic = new PictureModel();
      async.series([function find(callback){
        pic.findInTimeRange(from,to,callback);
      }],function complete(err,ok){
        var ret;
        if(err) {
          ret = {"error":"error finding range","code":err.code || 500, err:err.message || err};
        }else{
          ret = ok[0];
        }
        res.json(ret);
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
    },

    "serveImage": function (req,res){
      var filePath = req.query.filePath; //obv make this more secure
      console.log("filePath" ,filePath);
      if(!filePath || filePath.substr(0,9) !== "/opt/data"){
        res.status(401);
        res.json({"message":"no allowed"});
      }
      fs.exists(filePath, function (does){
        if(! does){
          res.status(404)
          return res.json(404);
        }
        var ext = path.extname(filePath);
        var contentType = 'text/plain';
        if (ext === '.JPEG') {
          contentType = 'image/jpeg'
        }
        var expire = (60 * 24) * 365;
        res.writeHead(200, {'Content-Type': contentType, "cache-control":"max-age="+expire });
        // stream the file
        fs.createReadStream(filePath, 'utf-8').pipe(res);
      });
    },
    "uploadImage" : function (req,res){
      if(app.rabbit.writable){
        app.rabbit.write(JSON.stringify({"":""}))
      }
      res.json({"message":"done"});
    }
  }
};
