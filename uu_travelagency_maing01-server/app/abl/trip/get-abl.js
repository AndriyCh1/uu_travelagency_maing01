"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/trip-error");
const Warnings = require("../../api/warnings/trip-warnings");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, TravelAgency, Trip } = require("../constants");
const StatesDeterminer = require("../../component/states-determiner");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRIP);
  }

  async get(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // HDS 1, 1.1
    const validationResult = this.validator.validate("tripGetDtoInType", dtoIn);

    // 1.2, 1.2.1, 1.3, 1.3.1
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
      [Profiles.TRIP_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
      [Profiles.READERS]: new Set([TravelAgency.States.ACTIVE]),
      [Profiles.LOCATION_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE]),
    };

    // 2.1, 2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Get,
      uuAppErrorMap
    );

    // HDS 3
    const allowedProfilesStates = {
      [Profiles.AUTHORITIES]: [Trip.States.INIT, Trip.States.ACTIVE, Trip.States.CLOSED],
      [Profiles.TRIP_EXECUTIVES]: [Trip.States.INIT, Trip.States.ACTIVE, Trip.States.CLOSED],
      [Profiles.READERS]: [TravelAgency.States.INIT, TravelAgency.States.ACTIVE],
      [Profiles.LOCATION_EXECUTIVES]: [TravelAgency.States.INIT, TravelAgency.States.ACTIVE],
    };

    const uuIdentityProfileList = authorizationResult.getIdentityProfiles();

    const allowedStates = StatesDeterminer.determine(allowedProfilesStates, uuIdentityProfileList);

    const trip = await this.dao.get(awid, dtoIn.id, allowedStates);
    if (!trip) {
      // 3.1
      throw new Errors.Get.TripDoesNotExist(uuAppErrorMap, { tripId: dtoIn.id });
    }

    // HDS 4
    const dtoOut = {
      ...trip,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new GetAbl();
