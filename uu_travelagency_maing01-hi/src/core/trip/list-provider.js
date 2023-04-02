//@@viewOn:imports
import { createComponent, useDataList, useEffect, useRef, useMemo } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const tripDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        reload: handleReload,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
      },
      pageSize: 10,
    });

    const filterList = useRef([]);
    const sorterList = useRef([]);

    function handleLoad(criteria) {
      if (criteria?.filterList) {
        filterList.current = criteria.filterList;
      }

      let sorter;
      if (criteria?.sorterList) {
        sorter = criteria.sorterList.at(criteria.sorterList.length - 1);
        sorterList.current = sorter ? [sorter] : [];
      } else {
        sorter = sorterList.current.at(0);
      }

      const dtoIn = prepareLoadDtoIn(filterList.current, sorter, criteria?.pageInfo);

      return Calls.Trip.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const criteria = prepareLoadDtoIn(filterList.current, sorterList.current, pageInfo);

      const dtoIn = { ...criteria, pageInfo };
      return Calls.Trip.list(dtoIn);
    }

    function handleReload() {
      return handleLoad({ filterList: filterList.current, sorterList: sorterList.current });
    }

    function handleCreate(values) {
      return Calls.Trip.create(values);
    }

    async function handleUpdate(trip) {
      return await Calls.Trip.update({ id: trip.id, ...trip });
    }

    function handleDelete(values) {
      return Calls.Trip.delete(values);
    }

    const value = useMemo(() => {
      return { tripDataList, filterList: filterList.current, sorterList: sorterList.current };
    }, [tripDataList]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function prepareLoadDtoIn(filterList, sorter, pageInfo) {
  const filterMap = filterList.reduce((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {});

  let dtoIn = { filterMap };

  if (sorter) {
    dtoIn.sortBy = sorter.key;
    dtoIn.order = sorter.ascending ? "asc" : "desc";
  }

  if (pageInfo) {
    dtoIn.pageInfo = pageInfo;
  }

  return dtoIn;
}

//@@viewOff:helpers
export default ListProvider;
