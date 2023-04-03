//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useCallback, useState, useRoute, useLsi } from "uu5g05";
import { Alert, Block, Button, Icon } from "uu5g05-elements";
import DataObjectStateResolver from "../data-object-state-resolver";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import Content from "./detail-view/content";
import DeleteModal from "./detail-view/delete-modal";
import UpdateModal from "./detail-view/update-modal";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  closeAlert: () =>
    Config.Css.css({
      borderRadius: "100%",
      marginLeft: "10px",
      padding: "0",
    }),
};
//@@viewOff:css

//@@viewOn:constants
const AlertPriority = {
  ERROR: "error",
  INFO: "info",
  SUCCESS: "success",
};
//@@viewOff:constants

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
    const [, setRoute] = useRoute();
    const lsi = useLsi(importLsi, [DetailView.uu5Tag]);

    const { tripDataObject, locationDataList } = props;
    const [updateData, setUpdateData] = useState({ shown: false });
    const [deleteData, setDeleteData] = useState({ shown: false });
    const [alertData, setAlertData] = useState({ shown: false, priority: AlertPriority.INFO, message: "" });

    const handleError = (message) => {
      setAlertData({ shown: true, message, priority: AlertPriority.ERROR });
    };

    const handleCloseAlert = () => {
      setAlertData({ shown: false });
    };

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
        <Block {...attrs} header={tripDataObject?.data?.name} headerType="heading" card="content">
          <DataObjectStateResolver dataObject={tripDataObject}>
            <DataListStateResolver dataList={locationDataList}>
              {() => {
                return (
                  <Content
                    tripDataObject={tripDataObject}
                    locationDataObject={getLocationDataObjectById(locationDataList, tripDataObject.data.locationId)}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                );
              }}
            </DataListStateResolver>
          </DataObjectStateResolver>
        </Block>
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
            onError={handleError}
            shown
          />
        )}
        {alertData.shown && alertData.priority === AlertPriority.ERROR && (
          <Alert
            header={getAlertHeader(lsi.failAlertHeader, handleCloseAlert)}
            message={alertData.message}
            priority={alertData.priority}
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

function getAlertHeader(text, handleClose) {
  return (
    <>
      {text}
      <Button className={Css.closeAlert()} onClick={handleClose}>
        <Icon icon="mdi-close-circle" />
      </Button>
    </>
  );
}

//@@viewOff:helpers

//@@viewOn:exports
export { DetailView };
export default DetailView;
//@@viewOff:exports
