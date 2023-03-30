//@@viewOn:imports
import { createVisualComponent, useCallback, Utils, PropTypes, Lsi, useLsi, useRoute } from "uu5g05";
import Uu5Elements, { useAlertBus } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
import Content from "./list-view/content";
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
    const [, setRoute] = useRoute();
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const { addAlert } = useAlertBus();
    const { tripDataList, locationDataList, filterList, sorterList } = props;

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

    const handleDetail = (trip) => {
      setRoute("tripDetail", { id: trip.id });
    };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props);
    const mappedTripByLocation = mapTripListDataByLocation(tripDataList, locationDataList);

    console.log(mappedTripByLocation, "----- mappedTripByLocation");
    return (
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
              />
            </DataListStateResolver>
          </DataListStateResolver>
        </Uu5Elements.Block>
      </ControllerProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers

// filter by location, date
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

// sort by date, price
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

function getActions(props) {
  const actionList = [];

  if (props.tripDataList.data) {
    actionList.push({
      component: FilterButton,
    });

    actionList.push({
      component: SorterButton,
    });
  }

  return actionList;
}

//@@viewOn:helpers
function mapTripListDataByLocation(tripDataList, locationDataList) {
  let trip;
  if (tripDataList.state === "ready" && locationDataList.state === "ready") {
    trip = tripDataList.data.map((tripItem) => {
      const location = getLocationById(locationDataList.data, tripItem.data.locationId);

      if (location) {
        tripItem.data.locationData = location.data;
      }

      return tripItem;
    });
  }

  return trip;
}

function getLocationById(locationDataList, id) {
  const location = locationDataList.find((location) => location.data.id === id);
  return location;
}
//@@viewOff:helpers
//@@viewOff:helpers

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
