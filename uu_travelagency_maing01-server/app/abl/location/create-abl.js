"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Profiles, Schemas, TravelAgency } = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    return { ...dtoIn, schema: "location" };
  }
}

module.exports = new CreateAbl();
