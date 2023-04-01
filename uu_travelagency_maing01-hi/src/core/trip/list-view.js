//@@viewOn:imports
import { createVisualComponent, useCallback, Utils, PropTypes, Lsi, useLsi, useRoute, useState } from "uu5g05";
import Uu5Elements, { useAlertBus, Link } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { useSystemData } from "uu_plus4u5g02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
import Content from "./list-view/content";
import CreateModal from "./list-view/create-modal";
import UpdateModal from "./list-view/update-modal";
import DeleteModal from "./list-view/delete-modal";
//@@viewOff:imports

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
    const { addAlert } = useAlertBus();
    const { data: systemData } = useSystemData();
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);

    const [createData, setCreateData] = useState({ shown: false });
    const [updateData, setUpdateData] = useState({ shown: false, id: undefined });
    const [deleteData, setDeleteData] = useState({ shown: false, id: undefined });

    let activeDataObject;
    const activeDataObjectId = updateData.id || deleteData.id;

    if (activeDataObjectId) {
      activeDataObject = getTripObjectById(tripDataList, activeDataObjectId);
    }

    const showError = useCallback(
      (error) =>
        addAlert({
          message: error.message,
          priority: "error",
        }),
      [addAlert]
    );

    const handleLoad = useCallback(
      async (event) => {
        try {
          await tripDataList.handlerMap.load(event?.data);
        } catch (error) {
          showError(error);
        }
      },
      [tripDataList, showError]
    );

    const handleLoadNext = useCallback(
      async (pageInfo) => {
        try {
          await tripDataList.handlerMap.loadNext(pageInfo);
        } catch (error) {
          showError(error);
        }
      },
      [tripDataList, showError]
    );

    function showCreateSuccess(trip) {
      const message = (
        <>
          <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessPrefix"]} />
          <Link colorSchema="primary" onClick={() => handleDetail({ id: trip.id })}>
            {trip.name}
          </Link>
          <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessSuffix"]} />
        </>
      );

      addAlert({ message, priority: "success", durationMs: 5000 });
    }

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
        props.tripDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating trip", error);
        showError(error);
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
          <Uu5Elements.Block
            {...attrs}
            actionList={actionList}
            header={<Lsi import={importLsi} path={[ListView.uu5Tag, "header"]} />}
            headerType="heading"
            card="none"
          >
            <DataListStateResolver dataList={tripDataList}>
              <DataListStateResolver dataList={locationDataList}>
                <Content
                  tripDataList={props.tripDataList}
                  locationDataList={props.locationDataList}
                  onLoadNext={handleLoadNext}
                  onDetail={handleDetail}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </DataListStateResolver>
            </DataListStateResolver>
          </Uu5Elements.Block>
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
    {
      key: "date",
      label: lsi.date,
    },
    {
      key: "price",
      label: lsi.price,
    },
  ];

  return sorters;
}

function getActions(props, actionPermissions, { handleCreate }) {
  const actionList = [];

  if (props.tripDataList.data) {
    actionList.push({
      component: FilterButton,
    });

    actionList.push({
      component: SorterButton,
    });

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

//@@viewOn:helpers
function getTripObjectById(tripDataList, id) {
  const trip =
    tripDataList.newData?.find((trip) => trip?.data.id === id) ||
    tripDataList?.data.find((trip) => trip.data.id === id);

  return trip;
}
//@@viewOff:helpers

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
