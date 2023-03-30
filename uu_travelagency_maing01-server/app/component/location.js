//@@viewOn:imports
const { Base64 } = require("uu_appg01_server").Utils;
const FileHelper = require("../helpers/file-helper");
//@@viewOff:imports

//@@viewOn:components
class Location {
  constructor() {}

  async checkAndGetImageAsStream(image, errors, uuAppErrorMap) {
    let streamToReturn;
    if (image.readable) {
      const { valid: isValidStream, stream } = await FileHelper.validateImageStream(image);
      if (!isValidStream) {
        throw new errors.InvalidImage({ uuAppErrorMap });
      }
      streamToReturn = stream;
    } else {
      let binaryBuffer = Base64.urlSafeDecode(image, "binary");
      if (!FileHelper.validateImageBuffer(binaryBuffer).valid) {
        throw new errors.InvalidImage({ uuAppErrorMap });
      }

      streamToReturn = FileHelper.toStream(binaryBuffer);
    }

    return streamToReturn;
  }
}
//@@viewOff:components

//@@viewOn:exports
module.exports = new Location();
//@@viewOff:exports
