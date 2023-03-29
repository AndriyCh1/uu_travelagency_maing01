"use strict";
const UuTravelAgencyError = require("./uu-travel-agency-error");

const Init = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  TravelAgencyDaoCreateFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}travelAgencyDaoCreateFailed`;
      this.message = "The system failed to create travelAgency.";
    }
  },
  SysSetProfileFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}setProfileFailed`;
      this.message = "Set uuAppProfile failed.";
    }
  },
};

module.exports = {
  Init,
};
