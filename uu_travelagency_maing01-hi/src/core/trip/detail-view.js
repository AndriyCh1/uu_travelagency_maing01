//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import DataObjectStateResolver from "../data-object-state-resolver";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import Content from "./detail-view/content";
//@@viewOff:imports

const DetailView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataObject: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataObject, locationDataList } = props;
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <Uu5Elements.Block {...attrs} header={tripDataObject?.data?.name} headerType="heading" card="content">
        <DataObjectStateResolver dataObject={tripDataObject}>
          <DataListStateResolver dataList={locationDataList}>
            {() => {
              const locationDataObject = getLocationDataObjectById(locationDataList, tripDataObject.data.locationId);
              return <Content tripDataObject={tripDataObject} locationDataObject={locationDataObject} />;
            }}
          </DataListStateResolver>
        </DataObjectStateResolver>
      </Uu5Elements.Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getLocationDataObjectById(locationDataList, id) {
  return locationDataList.data.find((location) => location.data.id === id);
}
//@@viewOff:helpers

//@@viewOn:exports
export { DetailView };
export default DetailView;
//@@viewOff:exports
