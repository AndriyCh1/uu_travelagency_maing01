"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/trip-error");
const Warnings = require("../../api/warnings/trip-warnings");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, TravelAgency, Trip, Location } = require("../constants");

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRIP);
    this.locationDao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // HDS 1, 1.1
    const validationResult = this.validator.validate("tripUpdateDtoInType", dtoIn);

    // 1.2, 1.2.1, 1.3, 1.3.1
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
      [Profiles.TRIP_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
    };

    // 2.1, 2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Update,
      uuAppErrorMap
    );

    // HDS 3
    const userProfile = authorizationResult.getAuthorizedProfiles();
    const isAuthorities = userProfile.includes(Profiles.AUTHORITIES);
    const isTripExecutives = userProfile.includes(Profiles.TRIP_EXECUTIVES);

    if (!isTripExecutives && !isAuthorities) {
      // 3.1
      throw new Errors.Update.UserNotAuthorized(
        { uuAppErrorMap },
        { userProfile, expectedProfile: [Profiles.AUTHORITIES, Profiles.TRIP_EXECUTIVES] }
      );
    }

    // HDS 4
    const trip = await this.dao.get(awid, dtoIn.id);

    if (!trip) {
      // 4.1
      throw new Errors.Update.TripDoesnotExist({ uuAppErrorMap }, { tripId: dtoIn.id });
    }

    // HDS 5
    let toUpdate = { id: dtoIn.id };

    if (dtoIn.name) {
      toUpdate.name = dtoIn.name;
    }

    if (dtoIn.text) {
      toUpdate.text = dtoIn.text;
    }

    const isInCorrectState = trip.state !== Trip.States.ACTIVE;
    const hasRequiredFields = dtoIn.locationId || dtoIn.price || dtoIn.date;
    const hasParticipants = trip.participantIdList?.length;

    if (hasRequiredFields) {
      if (!isInCorrectState && hasRequiredFields && hasParticipants) {
        throw new Errors.Update.UpdatingUnavailable(uuAppErrorMap);
      }

      toUpdate.price = dtoIn.price;
      toUpdate.date = dtoIn.date;
    }

    // HDS 6
    if (dtoIn.locationId) {
      // 6.1
      const locationStateCheck = await this.locationDao.getById(awid, dtoIn.locationId);

      if (!locationStateCheck) {
        // 6.2
        throw new Errors.Update.LocationDoesNotExist({ uuAppErrorMap });
      } else {
        toUpdate.locationId = dtoIn.locationId;
      }

      if (locationStateCheck.state === Location.States.PROBLEM || locationStateCheck.state === Location.States.CLOSED) {
        // 6.3
        throw new Errors.Update.LocationIsUnavailable({ uuAppErrorMap });
      }
    }

    // HDS 7
    if (dtoIn.date) {
      const creationDate = new Date();
      const date = new Date(dtoIn.date);

      if (date < creationDate) {
        throw new Errors.Update.InvalidDate({ uuAppErrorMap }, { date: dtoIn.date });
      }
    }

    // HDS 8
    toUpdate.awid = awid;
    let updatedTrip;

    try {
      updatedTrip = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // 8.1
        throw new Errors.Update.TripDaoUpdateFailed({ uuAppErrorMap }, { cause: e });
      }

      throw e;
    }

    // HDS 9
    const dtoOut = {
      ...updatedTrip,
      uuAppErrorMap,
    };

    return dtoOut;
  }

  async updateState(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate("tripUpdateStateDtoIn", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
    };

    // 2.1, 2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Update,
      uuAppErrorMap
    );

    const userProfile = authorizationResult.getAuthorizedProfiles();
    const isAuthorities = userProfile.includes(Profiles.AUTHORITIES);

    if (!isAuthorities) {
      throw new Errors.Update.UserNotAuthorized(
        { uuAppErrorMap },
        { userProfile, expectedProfile: [Profiles.AUTHORITIES] }
      );
    }

    const trip = await this.dao.get(awid, dtoIn.id);

    if (!trip) {
      throw new Errors.Update.TripDoesnotExist({ uuAppErrorMap }, { tripId: dtoIn.id });
    }

    let toUpdate = { ...dtoIn, awid };

    let updatedTrip;

    try {
      updatedTrip = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.TripDaoUpdateFailed({ uuAppErrorMap }, { cause: e });
      }

      throw e;
    }

    const dtoOut = {
      ...updatedTrip,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new UpdateAbl();
