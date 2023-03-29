"use strict";
const CreateAbl = require("../../abl/location/create-abl");

class TripController {
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  get(ucEnv) {}
  list(ucEnv) {}
  update(ucEnv) {}
  delete(ucEnv) {}
}

module.exports = new TripController();
