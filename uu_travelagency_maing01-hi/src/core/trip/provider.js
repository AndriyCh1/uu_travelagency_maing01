//@@viewOn:imports
import { createComponent, useDataObject, PropTypes } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const TripProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Provider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripId: PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const tripDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
        update: handleUpdate,
        delete: handleDelete,
      },
    });

    function handleLoad() {
      return Calls.Trip.get({ id: props.tripId });
    }

    function handleUpdate(trip) {
      return Calls.Trip.update({ id: trip.id, ...trip });
    }

    function handleDelete(trip) {
      return Calls.Trip.delete({ id: trip.id });
    }

    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(tripDataObject) : props.children;
    //@@viewOff:render
  },
});

export default TripProvider;
