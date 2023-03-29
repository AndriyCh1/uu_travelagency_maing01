"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, TravelAgency } = require("../constants");
const Errors = require("../../api/errors/locaton-error.js");
const Warnings = require("../../api/warnings/location-warnings.js");

const DEFAULTS = {
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate("locationListDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([
        TravelAgency.States.ACTIVE,
        TravelAgency.States.UNDER_CONSTRUCTION,
        TravelAgency.States.CLOSED,
      ]),
      [Profiles.LOCATION_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
      [Profiles.READERS]: new Set([TravelAgency.States.ACTIVE]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.List,
      uuAppErrorMap
    );

    let list = await this.dao.list(awid, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);

    const dtoOut = {
      ...list,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new ListAbl();
