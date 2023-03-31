//@@viewOn:imports
import { createVisualComponent, useRoute } from "uu5g05";
import Config from "./config/config";
import TripProvider from "../trip/provider";
import LocationListProvider from "../location/list-provider";
import DetailView from "../trip/detail-view";
//@@viewOff:imports

const TripDetail = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "TripDetail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <TripProvider tripId={props.tripId}>
        {(tripDataObject) => (
          <LocationListProvider>
            {(locationDataList) => <DetailView tripDataObject={tripDataObject} locationDataList={locationDataList} />}
          </LocationListProvider>
        )}
      </TripProvider>
    );
    //@@viewOff:render
  },
});

export default TripDetail;
