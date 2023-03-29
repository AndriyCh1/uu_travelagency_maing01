"use strict";
const CreateAbl = require("../../abl/trip/create-abl");
const ListAbl = require("../../abl/trip/list-abl");
const GetAbl = require("../../abl/trip/get-abl");
const UpdateAbl = require("../../abl/trip/update-abl");
const DeleteAbl = require("../../abl/trip/delete-abl");

class TripController {
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }

  delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.session, ucEnv.getAuthorizationResult());
  }
}

module.exports = new TripController();
