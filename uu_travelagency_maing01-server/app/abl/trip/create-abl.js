"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Profiles, Schemas, TravelAgency } = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRIP);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    return { ...dtoIn, schema: "trip" };
  }
}

module.exports = new CreateAbl();
