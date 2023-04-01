"use strict";
const InitAbl = require("../../abl/travel-agency/init-abl");
const LoadAbl = require("../../abl/travel-agency/load-abl");

class TravelAgencyController {
  init(ucEnv) {
    return InitAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return LoadAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new TravelAgencyController();
