"use strict";
const TravelagencyMainAbl = require("../../abl/travelagency-main-abl.js");

class TravelagencyMainController {
  init(ucEnv) {
    return TravelagencyMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return TravelagencyMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return TravelagencyMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new TravelagencyMainController();
