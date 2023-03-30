//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import Config from "./config/config";
import List from "../core/trip/list";
//@@viewOff:imports

const Trips = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Trips",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <RouteController>
        <RouteContainer>
          <List />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

export default Trips;
