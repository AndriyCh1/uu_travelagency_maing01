"use strict";
const CreateAbl = require("../../abl/trip/create-abl");
const ListAbl = require("../../abl/trip/list-abl");

class TripController {
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  get(ucEnv) {}

  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  update(ucEnv) {}
  delete(ucEnv) {}
}

module.exports = new TripController();
