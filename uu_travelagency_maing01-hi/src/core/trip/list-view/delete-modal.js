//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi, Utils } from "uu5g05";
import { Modal, Button } from "uu5g05-elements";
import { Form } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  modal: () =>
    Config.Css.css({
      textAlign: "center",
    }),
  actionButtons: () =>
    Config.Css.css({
      display: "flex",
      marginTop: "10px",
      gap: "20px",
      justifyContent: "center",
    }),
  button: () => Config.Css.css({}),
};
//@@viewOff:css

export const DeleteModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DeleteModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataObject: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteDone: PropTypes.func,
    onError: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    shown: false,
    onCancel: () => {},
    onDeleteDone: () => {},
    onError: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataObject, shown, onDeleteDone, onCancel, onClose, onError } = props;
    const lsi = useLsi(importLsi, [DeleteModal.uu5Tag]);

    async function handleDelete() {
      try {
        await tripDataObject.handlerMap.delete();
        onDeleteDone();
      } catch (error) {
        onError(error.message);
        DeleteModal.logger.error("Error submitting form", error);
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const trip = tripDataObject.data;

    return (
      <Form>
        <Modal header={lsi.header} open={shown} onClose={onClose} className={Css.modal()}>
          {Utils.String.format(lsi.submitting, trip.name)}
          <div className={Css.actionButtons()}>
            <Button onClick={onCancel} className={Css.button()}>
              {lsi.cancel}
            </Button>
            <Button onClick={handleDelete} className={Css.button()} colorScheme="negative">
              {lsi.delete}
            </Button>
          </div>
        </Modal>
      </Form>
    );
    //@@viewOff:render
  },
});

export default DeleteModal;
