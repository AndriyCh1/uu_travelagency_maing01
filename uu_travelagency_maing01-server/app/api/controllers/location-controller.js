"use strict";
const CreateAbl = require("../../abl/location/create-abl");
const ListAbl = require("../../abl/location/list-abl");

class LocationController {
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

module.exports = new LocationController();
