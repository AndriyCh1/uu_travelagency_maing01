"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, TravelAgency } = require("../constants");
const Errors = require("../../api/errors/trip-error.js");
const Warnings = require("../../api/warnings/trip-warnings.js");

const DEFAULTS = {
  sortBy: "date",
  order: "asc",
  pageIndex: 0,
  pageSize: 10,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRIP);
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // HDS 1, 1.1
    const validationResult = this.validator.validate("tripListDtoInType", dtoIn);

    // 1.2, 1.2.1, 1.3, 1.3.1
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // 1.4
    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    // HDS 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([
        TravelAgency.States.ACTIVE,
        TravelAgency.States.UNDER_CONSTRUCTION,
        TravelAgency.States.CLOSED,
      ]),
      [Profiles.TRIP_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
      [Profiles.READERS]: new Set([TravelAgency.States.ACTIVE]),
      [Profiles.LOCATION_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE]),
    };

    // 2.1, 2.1.1, 2.2, 2.2.1, 2.2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.List,
      uuAppErrorMap
    );

    // HDS 3
    let list;
    const { sortBy, order, pageInfo } = dtoIn;

    if (!(dtoIn?.filterMap?.locationId && dtoIn?.filterMap?.dateFrom && dtoIn?.filterMap?.dateTo)) {
      list = await this.dao.list(awid, sortBy, order, pageInfo);
    } else {
      list = await this.dao.listByLocationIdAndDate(awid, sortBy, order, pageInfo, dtoIn.filterMap);
    }

    // HDS 4
    // TODO: find out if this HDS is necessary

    // HDS 5
    const dtoOut = {
      ...list,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new ListAbl();
