"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { AuthorizationService } = require("uu_appg01_server").Authorization;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const InstanceChecker = require("../../component/instance-checker");
const Errors = require("../../api/errors/travel-agency-error.js");
const { Schemas } = require("../constants.js");

class LoadAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRAVEL_AGENCY);
    this.locationDao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async load(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);

    // HDS 2
    const awid = uri.getAwid();
    const awidData = await UuAppWorkspace.get(awid);

    // HDS 3
    const relatedObjectsMap = {};

    // HDS 4
    const cmdUri = UriBuilder.parse(uri).setUseCase("sys/uuAppWorkspace/load");
    const authorizationResult = await AuthorizationService.authorize(session, cmdUri.toUri());

    const profileData = {
      uuIdentityProfileList: authorizationResult.getIdentityProfiles(),
      profileList: authorizationResult.getAuthorizedProfiles(),
    };

    // HDS 5
    dtoOut.sysData = {
      ...dtoOut.sysData,
      awidData,
      profileData,
    };

    // HDS 6
    if (
      awidData.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
      awidData.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    ) {
      const travelAgency = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);
      const locationList = await this.locationDao.list(awid);

      dtoOut.data = { ...travelAgency, locationList: locationList.itemList, relatedObjectsMap };
    }

    // HDS 7
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new LoadAbl();
