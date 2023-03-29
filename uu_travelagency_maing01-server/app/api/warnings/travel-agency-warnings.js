const Errors = require("../errors/travel-agency-error.js");

const Warnings = {
  Init: {
    UnsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
