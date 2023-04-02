//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { Grid } from "uu5tilesg02-elements";
import { FilterBar, FilterManagerModal, SorterBar, SorterManagerModal } from "uu5tilesg02-controls";
import Tile from "./tile";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
//@@viewOff:css

export const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    onLoadNext: PropTypes.func,
    onDetail: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataList, locationDataList, ...tileProps } = props;
    const pageSize = tripDataList.pageSize;

    const handleLoadNext = ({ indexFrom, count }) => {
      props.onLoadNext({ pageSize, pageIndex: Math.floor(indexFrom / pageSize) });
    };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(tileProps);

    return (
      <div {...attrs}>
        <FilterBar disabled={tripDataList.state !== "ready"} />
        <SorterBar disabled={tripDataList.state !== "ready"} />
        <Grid onLoad={handleLoadNext} tileMinWidth={300} tileMaxWidth={500} tileMaxHeigh={400}>
          {(tripDataObject) => (
            <Tile
              {...tileProps}
              tripDataObject={tripDataObject.data}
              locationDataObject={getLocationObjectById(locationDataList, tripDataObject.data.data.locationId)}
              onDetail={props.onDetail}
              onUpdate={props.onUpdate}
              onDelete={props.onDelete}
            />
          )}
        </Grid>
        <FilterManagerModal />
        <SorterManagerModal />
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getLocationObjectById(locationDataList, id) {
  const location = locationDataList.data.find((location) => location.data.id === id);
  return location;
}
//@@viewOff:helpers

export default Content;
