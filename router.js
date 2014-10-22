var picController = require('./controller/pictureController')();
module.exports = function (app){

  app.get("/pictures/:lon/:lat/:from/:to",picController.getPicsByLocation);
  app.get("/pictures/range/:user", picController.getYearRange);

};
