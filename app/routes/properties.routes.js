module.exports = app => {
  const properties = require("../controllers/properties.controller.js");

  // scrap texas data from website
  app.get('/texas', properties.create);

  // scrap florida data from website
  app.get('/floridahealthfinder', properties.createFlorida);

  // get all property lists
  app.get("/properties", properties.findAll);
  //
  // get property by filteritem
  app.get("/filterItem", properties.filterProperties);

  // get images with property id
  app.get("/images", properties.findImagesById);
};
