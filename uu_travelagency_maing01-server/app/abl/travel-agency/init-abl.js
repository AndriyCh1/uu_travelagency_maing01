"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/travel-agency-error.js");
const Warnings = require("../../api/warnings/travel-agency-warnings");
const { Schemas, TravelAgency } = require("../constants.js");

class InitAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRAVEL_AGENCY);
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);

    // 1.1, 1.2, 1.2.1, 1.3, 1.3.1, 1.4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Init.UnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    Object.values(Schemas).forEach(async (schema) => {
      try {
        return DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // 2.1
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { cause: e });
      }
    });

    // HDS 3
    let travelAgency = await this.dao.getByAwid(awid);

    // HDS 4, HDS 5
    if (!travelAgency) {
      // 4.1, 4.2
      const travelAgencyUuObject = {
        name: dtoIn.name,
        state: TravelAgency.States.ACTIVE,
        awid,
      };

      try {
        // 5.1
        await this.dao.create(travelAgencyUuObject);
      } catch (error) {
        throw new Errors.Init.TravelAgencyDaoCreateFailed({ uuAppErrorMap }, { cause: e });
      }
    }

    // TODO: find out whether It has to be or not
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // HDS 6
    const workspace = UuAppWorkspace.get(awid);

    const dtoOut = {
      ...workspace,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new InitAbl();
