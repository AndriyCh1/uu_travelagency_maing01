//@@viewOn:imports
import { createVisualComponent, useCallback, Utils, PropTypes, Lsi, useLsi, useRoute, useState } from "uu5g05";
import { Icon, Button, Link, Alert, AlertBus, Block } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { useSystemData } from "uu_plus4u5g02";
import { FilterButton, SearchButton, SorterButton } from "uu5tilesg02-controls";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
import Content from "./list-view/content";
import CreateModal from "./list-view/create-modal";
import UpdateModal from "./list-view/update-modal";
import DeleteModal from "./list-view/delete-modal";
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

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    filterList: PropTypes.array.isRequired,
    sorterList: PropTypes.array.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataList, locationDataList, filterList, sorterList } = props;

    const [, setRoute] = useRoute();
    const { data: systemData } = useSystemData();
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);

    const [createData, setCreateData] = useState({ shown: false });
    const [updateData, setUpdateData] = useState({ shown: false, id: undefined });
    const [deleteData, setDeleteData] = useState({ shown: false, id: undefined });

    const [alertData, setAlertData] = useState({ shown: false, priority: AlertPriority.INFO, message: "" });

    let activeDataObject;
    const activeDataObjectId = updateData.id || deleteData.id;

    if (activeDataObjectId) {
      activeDataObject = getTripObjectById(tripDataList, activeDataObjectId);
    }

    const handleLoad = useCallback(
      async (event) => {
        try {
          await tripDataList.handlerMap.load(event?.data);
        } catch (error) {
          setAlertData({ shown: true, message: error, priority: AlertPriority.ERROR });
        }
      },
      [tripDataList]
    );

    const handleLoadNext = useCallback(
      async (pageInfo) => {
        try {
          await tripDataList.handlerMap.loadNext(pageInfo);
        } catch (error) {
          setAlertData({ shown: true, message: error, priority: AlertPriority.ERROR });
        }
      },
      [tripDataList]
    );

    const showCreateSuccess = (trip) => {
      const message = (
        <Link colorSchema="primary" onClick={() => handleDetail({ id: trip.id })}>
          {lsi.createSuccess}
        </Link>
      );

      setAlertData({ shown: true, message, priority: AlertPriority.SUCCESS });
    };

    const handleCloseAlert = () => {
      console.log("handleClsoeAlert ");
      setAlertData({ shown: false });
    };

    const handleDetail = (trip) => {
      setRoute("tripDetail", { id: trip.id });
    };

    const handleCreate = useCallback(() => {
      setCreateData({ shown: true });
    }, [setCreateData]);

    const handleCreateDone = (trip) => {
      setCreateData({ shown: false });
      showCreateSuccess(trip);

      try {
        tripDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating trip", error);
        setAlertData({ shown: true, message: error, priority: AlertPriority.ERROR });
      }
    };

    const handleCreateCancel = () => {
      setCreateData({ shown: false });
    };

    const handleUpdate = useCallback(
      (tripDataObject) => {
        setUpdateData({ shown: true, id: tripDataObject.data.id });
      },
      [setUpdateData]
    );

    const handleUpdateDone = () => {
      setUpdateData({ shown: false });
      setAlertData({ shown: true, message: lsi.updateSuccess, priority: AlertPriority.SUCCESS });
    };

    const handleUpdateCancel = () => {
      setUpdateData({ shown: false });
    };

    const handleDelete = useCallback(
      (tripDataObject) => setDeleteData({ shown: true, id: tripDataObject.data.id }),
      [setDeleteData]
    );

    const handleDeleteDone = () => {
      setDeleteData({ shown: false });
    };

    const handleDeleteCancel = () => setDeleteData({ shown: false });

    const profileList = systemData.profileData.uuIdentityProfileList;
    const isAuthority = profileList.includes("Authorities");
    const isTripExecutive = profileList.includes("TripExecutives");

    const actionPermissions = { trip: { create: isAuthority || isTripExecutive } };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props, actionPermissions, { handleCreate });

    return (
      <>
        <ControllerProvider
          data={tripDataList.data}
          filterDefinitionList={getFilters(locationDataList, lsi)}
          sorterDefinitionList={getSorters(lsi)}
          filterList={filterList}
          sorterList={sorterList}
          onFilterChange={handleLoad}
          onSorterChange={handleLoad}
        >
          <Block
            {...attrs}
            actionList={actionList}
            header={<Lsi import={importLsi} path={[ListView.uu5Tag, "header"]} />}
            headerType="heading"
            card="none"
          >
            <DataListStateResolver dataList={tripDataList}>
              <DataListStateResolver dataList={locationDataList}>
                <Content
                  tripDataList={tripDataList}
                  locationDataList={locationDataList}
                  onLoadNext={handleLoadNext}
                  onDetail={handleDetail}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </DataListStateResolver>
            </DataListStateResolver>
          </Block>
        </ControllerProvider>
        {createData.shown && (
          <CreateModal
            tripDataList={props.tripDataList}
            locationDataList={props.locationDataList}
            shown={true}
            onSaveDone={handleCreateDone}
            onCancel={handleCreateCancel}
          />
        )}
        {updateData.shown && (
          <UpdateModal
            tripDataObject={activeDataObject}
            locationDataList={locationDataList}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
            shown
          />
        )}
        {deleteData.shown && activeDataObject && (
          <DeleteModal
            tripDataObject={activeDataObject}
            onDeleteDone={handleDeleteDone}
            onCancel={handleDeleteCancel}
            onClose={handleDeleteCancel}
            shown
          />
        )}
        {alertData.shown && alertData.priority === AlertPriority.SUCCESS && (
          <Alert
            header={getAlertHeader(lsi.successAlertHeader, handleCloseAlert)}
            message={alertData.message}
            priority={alertData.priority}
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
function getFilters(locationDataList, lsi) {
  let filterList = [];

  if (locationDataList.state === "ready") {
    const locationFilter = {
      key: "locationId",
      label: lsi.location,
      inputType: "text-select",
      inputProps: {
        multiple: false,
        itemList: locationDataList.data.map((location) => ({
          value: location.data.id,
          children: location.data.name,
        })),
      },
    };

    const dateFromFilter = {
      key: "dateFrom",
      label: lsi.dateFrom,
      inputType: "date",
      shortDateFormat: "YYYY-MM-DD",
    };

    const dateToFilter = {
      key: "dateTo",
      label: lsi.dateTo,
      inputType: "date",
      shortDateFormat: "YYYY-MM-DD",
    };

    filterList.push(locationFilter, dateFromFilter, dateToFilter);
  }

  return filterList;
}

function getSorters(lsi) {
  const sorters = [
    { key: "date", label: lsi.date },
    { key: "price", label: lsi.price },
  ];

  return sorters;
}

function getActions(props, actionPermissions, { handleCreate }) {
  const actionList = [];

  if (props.tripDataList.data) {
    actionList.push({ component: FilterButton });
    actionList.push({ component: SorterButton });

    if (actionPermissions.trip.create) {
      actionList.push({
        icon: "mdi-plus",
        children: <Lsi import={importLsi} path={[ListView.uu5Tag, "createTrip"]} />,
        primary: true,
        onClick: handleCreate,
        disabled: props.disabled,
      });
    }
  }

  return actionList;
}

function getTripObjectById(tripDataList, id) {
  const trip =
    tripDataList.newData?.find((trip) => trip?.data.id === id) ||
    tripDataList?.data.find((trip) => trip.data.id === id);

  return trip;
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
export { ListView };
export default ListView;
//@@viewOff:exports
