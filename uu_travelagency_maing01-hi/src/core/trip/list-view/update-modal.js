//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi, Utils } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { UuDate } from "uu_i18ng01";
import {
  Form,
  FormText,
  FormSelect,
  FormNumber,
  FormDate,
  FormTextArea,
  SubmitButton,
  CancelButton,
} from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  input: () =>
    Config.Css.css({
      marginBottom: "15px",
    }),
  footer: () => Config.Css.css({ display: "flex", justifyContent: "flex-end", gap: 10 }),
};
//@@viewOff:css

export const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataObject: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onCancel: PropTypes.func,
    onSaveDone: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    shown: false,
    onCancel: () => {},
    onSaveDone: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataObject, locationDataList, onCancel, onSaveDone } = props;
    const lsi = useLsi(importLsi, [UpdateModal.uu5Tag]);
    const trip = tripDataObject.data;

    async function handleSubmit(event) {
      try {
        await tripDataObject.handlerMap.update({ id: tripDataObject.data.id, ...event.data.value });
        onSaveDone(trip);
      } catch (error) {
        UpdateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
    }

    const handleValidateDate = async (e) => {
      const minDate = new UuDate().format("en-US", { format: "YYYY-MM-DD" });
      const value = e.data.value;

      if (value < minDate) {
        return {
          message: {
            en: "The trip must start no earlier than today.",
            cs: "Výlet musí začínat nejdříve dnes.",
            uk: "Поїздка повинна починатися не раніше ніж сьогодні.",
          },
          messageParams: [minDate],
        };
      }
    };
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.Provider onSubmit={handleSubmit}>
        <Modal
          header={lsi.header}
          open={props.shown}
          footer={
            <div className={Css.footer()}>
              <CancelButton onClick={onCancel}>{lsi.cancel}</CancelButton>
              <SubmitButton>{lsi.submit}</SubmitButton>
            </div>
          }
        >
          <Form.View>
            <FormText
              label={lsi.name}
              name="name"
              inputAttrs={{ maxLength: 255 }}
              className={Css.input()}
              initialValue={trip.name}
              required
            />
            <FormSelect
              label={lsi.location}
              name="locationId"
              initialValue={trip.locationId}
              itemList={mapLocationToItemList(locationDataList)}
              className={Css.input()}
              required
            />
            <FormNumber
              label={lsi.price}
              name="price"
              className={Css.input()}
              initialValue={trip.price}
              min={0}
              required
            />
            <FormDate
              label={lsi.date}
              name="date"
              className={Css.input()}
              pickerType="horizontal"
              initialValue={trip.date}
              onValidate={handleValidateDate}
              required
            />
            <FormTextArea
              label={lsi.text}
              name="text"
              inputAttrs={{ maxLength: 5000 }}
              className={Css.input()}
              rows={10}
              initialValue={trip.text}
              required
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

function mapLocationToItemList(locationDataList) {
  return locationDataList.data.map((location) => ({ value: location.data.id, children: location.data.name }));
}

export default UpdateModal;
