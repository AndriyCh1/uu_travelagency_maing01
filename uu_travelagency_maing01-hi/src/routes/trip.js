//@@viewOn:imports
import { createVisualComponent, useRoute } from "uu5g05";
import Config from "./config/config";
import TripProvider from "../core/trip/provider";
import LocationListProvider from "../core/location/list-provider";
import DetailView from "../core/trip/detail-view";
//@@viewOff:imports

const Trip = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Trip",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const [route] = useRoute();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <TripProvider tripId={route.params.id}>
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

export default Trip;
