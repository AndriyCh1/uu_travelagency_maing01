"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/travel-agency-error.js");
const Warnings = require("../../api/warnings/travel-agency-warnings");
const { Schemas, TravelAgency } = require("../constants.js");

class LoadAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.TRAVEL_AGENCY);
  }

  async load(uri, session, uuAppErrorMap = {}) {
    // TODO Implement according to application needs...
    // let awid = uri.getAwid();
    //
    // // HDS 1
    // const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);
    //
    // if (dtoOut.territoryData) {
    //   dtoOut.territoryData = {
    //     data: {
    //       ...dtoOut.territoryData.data.data,
    //       uuAppWorkspaceUri: dtoOut.territoryData.data.artifact.uuAppWorkspaceUri,
    //     },
    //     sysData: dtoOut.territoryData.sysData,
    //   };
    // }
    //
    // // HDS 2
    // const sysState = dtoOut.sysData.awidData.sysState;
    //
    // if (sysState !== UuAppWorkspace.SYS_STATES.CREATED && sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED) {
    //   const trips = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);
    //   const categoryList = await this.categoryDao.list(awid);
    //   dtoOut.data = { ...trips, categoryList: categoryList.itemList, relatedObjectsMap: {} };
    // }
    //
    // // HDS 3
    // dtoOut.uuAppErrorMap = uuAppErrorMap;
    // return dtoOut;
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // const awid = uri.getAwid();
    // const workspace = await UuAppWorkspace.get(awid);
    // if (workspace.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
    //    workspace.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    // ) {
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }
}

module.exports = new LoadAbl();
