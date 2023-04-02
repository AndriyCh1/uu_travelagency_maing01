//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useState, useMemo } from "uu5g05";
import { Grid } from "uu5tilesg02-elements";
import { Pagination } from "uu5g05-elements";
import { FilterBar, FilterManagerModal, SorterBar, SorterManagerModal } from "uu5tilesg02-controls";
import Tile from "./tile";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  pagination: () =>
    Config.Css.css({
      marginTop: "10px",
    }),
};
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
    const { tripDataList, locationDataList, onLoadNext, ...tileProps } = props;
    const pageSize = tripDataList.pageSize;
    const [shownPageIndex, setShownPageIndex] = useState(0);
    const data = tripDataList.data;
    const total = data ? data.length : 0;

    const onPaginationChange = ({ index }) => {
      onLoadNext({ pageIndex: index, pageSize });
      setShownPageIndex(index);
    };

    const dataToRender = useMemo(() => {
      return data?.slice(shownPageIndex * pageSize, shownPageIndex * pageSize + pageSize);
    }, [data]);
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(tileProps);

    return (
      <div {...attrs}>
        <FilterBar disabled={tripDataList.state !== "ready"} />
        <SorterBar disabled={tripDataList.state !== "ready"} />
        <Grid tileMinWidth={300} tileMaxWidth={500} tileMaxHeigh={400} data={dataToRender}>
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
        <Pagination
          className={Css.pagination()}
          index={shownPageIndex}
          type="pages"
          size="xl"
          count={Math.ceil(total / pageSize)}
          onChange={(e) => onPaginationChange({ index: e.data.index })}
          disabled={!data || !tripDataList.handlerMap.loadNext}
        />
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
