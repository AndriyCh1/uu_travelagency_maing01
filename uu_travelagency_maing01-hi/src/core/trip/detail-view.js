//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useCallback, useState, useRoute } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import DataObjectStateResolver from "../data-object-state-resolver";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import Content from "./detail-view/content";
import DeleteModal from "./detail-view/delete-modal";
import UpdateModal from "./detail-view/update-modal";
import { useSystemData } from "uu_plus4u5g02";
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
    const [updateData, setUpdateData] = useState({ shown: false });
    const [deleteData, setDeleteData] = useState({ shown: false });
    const [, setRoute] = useRoute();

    const handleUpdate = useCallback(() => {
      setUpdateData({ shown: true });
    }, [setUpdateData]);

    const handleUpdateDone = () => {
      setUpdateData({ shown: false });
    };

    const handleUpdateCancel = () => {
      setUpdateData({ shown: false });
    };

    const handleDelete = useCallback(() => setDeleteData({ shown: true }), [setDeleteData]);

    const handleDeleteDone = () => {
      setRoute("");
    };

    const handleDeleteCancel = () => setDeleteData({ shown: false });
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <>
        <Uu5Elements.Block {...attrs} header={tripDataObject?.data?.name} headerType="heading" card="content">
          <DataObjectStateResolver dataObject={tripDataObject}>
            <DataListStateResolver dataList={locationDataList}>
              {() => {
                const locationDataObject = getLocationDataObjectById(locationDataList, tripDataObject.data.locationId);
                return (
                  <Content
                    tripDataObject={tripDataObject}
                    locationDataObject={locationDataObject}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                );
              }}
            </DataListStateResolver>
          </DataObjectStateResolver>
        </Uu5Elements.Block>
        {updateData.shown && (
          <UpdateModal
            tripDataObject={tripDataObject}
            locationDataList={locationDataList}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
            shown
          />
        )}
        {deleteData.shown && tripDataObject.data && (
          <DeleteModal
            tripDataObject={tripDataObject}
            onDeleteDone={handleDeleteDone}
            onCancel={handleDeleteCancel}
            onClose={handleDeleteCancel}
            shown
          />
        )}
      </>
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
