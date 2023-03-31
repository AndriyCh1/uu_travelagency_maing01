"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/trip-error");
const Warnings = require("../../api/warnings/trip-warnings");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Trip, TravelAgency, Location } = require("../constants");

const DEFAULTS = {
  state: Trip.States.INIT,
};

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRIP);
    this.locationDao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // HDS 1, 1.1
    const validationResult = this.validator.validate("tripCreateDtoInType", dtoIn);

    // 1.2, 1.2.1, 1.3, 1.3.1
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    const addedValues = {
      uuIdentity: session.getIdentity().getUuIdentity(),
      creatorName: session.getIdentity().getName(),
      creationDate: new Date(),
      state: DEFAULTS.state,
    };

    const uuObject = {
      ...dtoIn,
      ...addedValues,
    };

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
      Errors.Create,
      uuAppErrorMap
    );

    // HDS 3
    const creationDate = addedValues.creationDate;
    const date = new Date(dtoIn.date);

    if (date < creationDate) {
      throw new Errors.Create.InvalidDate({ uuAppErrorMap }, { date: dtoIn.date });
    }

    // HDS 4, 4.1
    let locationStateCheck = await this.locationDao.getById(awid, dtoIn.locationId);

    // 4.2
    if (!locationStateCheck) {
      throw new Errors.Create.LocationDoesNotExist({ uuAppErrorMap });
    }

    // 4.3
    if (locationStateCheck.state === Location.States.PROBLEM || locationStateCheck.state === Location.States.CLOSED) {
      throw new Errors.Create.LocationIsUnavailable({ uuAppErrorMap });
    }

    // HDS 5
    uuObject.awid = awid;
    let trip;

    try {
      trip = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.TripDaoCreateFailed({ uuAppErrorMap }, { cause: e });
      }
      throw e;
    }

    // HDS 6
    const dtoOut = { ...trip, uuAppErrorMap };
    return dtoOut;
  }
}

module.exports = new CreateAbl();
