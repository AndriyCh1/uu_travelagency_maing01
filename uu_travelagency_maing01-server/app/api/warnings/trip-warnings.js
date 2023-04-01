const Errors = require("../errors/trip-error.js");

const Warnings = {
  Create: {
    UnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
  Delete: {
    UnsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
};

module.exports = Warnings;
