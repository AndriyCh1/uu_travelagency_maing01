//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import TripListProvider from "./list-provider";
import LocationListProvider from "../location/list-provider";
import Config from "./config/config";
import ListView from "./list-view";
//@@viewOff:imports

export const List = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "List",
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
      <TripListProvider>
        {({ tripDataList, filterList, sorterList }) => (
          <LocationListProvider>
            {(locationDataList) => (
              <ListView
                tripDataList={tripDataList}
                locationDataList={locationDataList}
                filterList={filterList}
                sorterList={sorterList}
              />
            )}
          </LocationListProvider>
        )}
      </TripListProvider>
    );
    //@@viewOff:render
  },
});

export default List;
