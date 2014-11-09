
module.exports = function (app){
  console.log("pre pic controller");
  var picController = require('./controller/pictureController')(app);
  console.log("pic controller");

  app.get("/pictures/:lon/:lat/:from/:to",picController.getPicsByLocation);
  app.get("/pictures/range/:user", picController.getYearRange);
  app.get("/pictures/:from/:to",picController.getPicsFromDateRange);
  app.get("/pictures",picController.serveImage);
  app.post("/pictures/upload",picController.uploadImage);
  app.get("/pictures/track",picController.updateForJob);
};
