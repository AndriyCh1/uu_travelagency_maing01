"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/trip-error");
const Warnings = require("../../api/warnings/trip-warnings");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Trip, TravelAgency } = require("../constants");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRIP);
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // HDS 1, 1.1
    const validationResult = this.validator.validate("tripDeleteDtoInType", dtoIn);

    // 1.2, 1.2.1, 1.3, 1.3.1
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
    };

    // 2.1, 2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Delete,
      uuAppErrorMap
    );

    // HDS 3
    // TODO: uuIdentity
    // const uuIdentity = session.getIdentity().getUuIdentity();

    const userProfile = authorizationResult.getAuthorizedProfiles();
    const isAuthorities = userProfile.includes(Profiles.AUTHORITIES);

    if (!isAuthorities) {
      // 3.1
      throw new Errors.Delete.UserNotAuthorized(
        { uuAppErrorMap },
        { userProfile, expectedProfile: [Profiles.AUTHORITIES] }
      );
    }

    // HDS 4
    const trip = await this.dao.get(awid, dtoIn.id);

    if (!trip) {
      // 4.1
      throw new Errors.Delete.TripDoesNotExist({ uuAppErrorMap }, { tripId: dtoIn.id });
    }

    // HDS 5
    if (trip.state !== Trip.States.CLOSED) {
      throw new Errors.Delete.DeletingUnavailable({ uuAppErrorMap });
    }

    // HDS 6
    await this.dao.delete(awid, trip.id);

    // HDS 7
    const dtoOut = { uuAppErrorMap };

    return dtoOut;
  }
}

module.exports = new DeleteAbl();
