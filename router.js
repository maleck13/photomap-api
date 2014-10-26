
module.exports = function (app){
  var picController = require('./controller/pictureController')(app);

  app.get("/pictures/:lon/:lat/:from/:to",picController.getPicsByLocation);
  app.get("/pictures/range/:user", picController.getYearRange);
  app.get("/pictures/:from/:to",picController.getPicsFromDateRange);
  app.get("/pictures",picController.serveImage);
};
