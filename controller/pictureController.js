var PictureModel = require('../model/picture');
var async = require('async');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var conf = require('../config/conf')();
var rabbit = require('rabbit.js').createContext(conf.getRabbitUrl());
var util = require('util');

module.exports = function (app){


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
        console.log("ext ", ext);
        var contentType = 'text/plain';
        if (ext === '.JPG') {
          contentType = 'image/jpeg'
        }
        var expire = (60 * 24) * 365;
        res.writeHead(200, {'Content-Type': contentType, "Cache-Control":"max-age="+expire });
        // stream the file
        fs.createReadStream(filePath, 'utf-8').pipe(res);
      });
    },
    "uploadImage" : function (req,res){
      var form = new formidable.IncomingForm();
      var outPath;
      var fileName;
      form.uploadDir = "/tmp/";

      form.parse(req, function(err, fields, files) {
        console.log("files: ",files);
        async.series([function(callback){
          fileName = files.file.name;
          outPath = conf.getPicDir() + "/" + files.file.name;
          console.log("writing to ", outPath);
          var rs = fs.createReadStream(files.file.path);
          var ws = fs.createWriteStream(outPath);
          rs.pipe(ws);
          rs.on('error', callback);
          ws.on('error',callback);
          ws.on('end',function (){
            console.log("end of ws ");
            callback();
          });
          ws.on("close", function (){
            console.log("close of ws ");
            callback();
          });

        }], function(err,ok){
          console.log("done sending to rabbut");
          if(app.rabbitPub && app.rabbitPub.writable){
            //res key is used to get info back from rabbit
            var resKey = "key" +  new Date().getTime() + Math.floor(Math.random() * 10000000)+"key";
            app.rabbitPub.write(JSON.stringify({"file":fileName,"resKey":resKey}));
          }
          res.json({"message":"done","key":resKey});
        });
      });

    },
    "updateForJob" : function (req,res){
      var resOb = [];
      var key = req.query.key;
      if(! key ){
        res.statusCode = 400;
        return res.json({"error":"missing param key"});
      }
      key = key.replace(/[^a-zA-Z0-9 -]/,"");

      var sub = rabbit.socket("WORKER",{"routing":"direct","persistent":false});
      sub.connect(key, function (ch){
        console.log("sub connect ",ch);

        setTimeout(function (){
          console.log("closing sub");
          sub.close();
          res.json(resOb);
        },2000);
        console.log("socket connected");

        sub.on("readable", function (){
          console.log("socke readable");
        });
        sub.on("data",function (d){
          console.log("data ", d.toString());
          resOb.push(JSON.parse(d));
          sub.ack()
        });
      });

    }
  }
};
