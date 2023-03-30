"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
const LocationComponent = require("../../component/location");
const Warnings = require("../../api/warnings/location-warnings");
const Errors = require("../../api/errors/locaton-error");
const { Profiles, Schemas, TravelAgency, Location } = require("../constants");
const InstanceChecker = require("../../component/instance-checker");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate("locationCreateDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    const addedValues = {
      state: Location.States.ACTIVE,
    };

    const uuObject = {
      ...dtoIn,
      ...addedValues,
    };

    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
      [Profiles.LOCATION_EXECUTIVES]: new Set([TravelAgency.States.ACTIVE, TravelAgency.States.UNDER_CONSTRUCTION]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Create,
      uuAppErrorMap
    );

    if (dtoIn.image) {
      const image = await LocationComponent.checkAndGetImageAsStream(dtoIn.image, Errors.Create, uuAppErrorMap);
      try {
        const binary = await UuBinaryAbl.createBinary(awid, {
          data: image,
          filename: dtoIn.image.filename,
          contentType: dtoIn.image.contentType,
        });
        uuObject.image = binary.code;
      } catch (e) {
        throw new Errors.Create.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
    }

    uuObject.awid = awid;
    let location;

    try {
      location = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.LocationDaoCreateFailed({ uuAppErrorMap }, { cause: e });
      }
      throw e;
    }

    const dtoOut = { ...location, uuAppErrorMap };
    return dtoOut;
  }
}

module.exports = new CreateAbl();
