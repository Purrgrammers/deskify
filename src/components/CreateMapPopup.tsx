import { FocusElementTransform, MapContext } from "@/contexts/MapContext";
import { Pencil, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import RoomInfoForm from "./RoomInfoForm";

const CreateMapPopup = () => {
  const { deleteRoom, deleteDesk, focusElement, updateFocusElement } = useContext(MapContext);
  const [editMode, setEditMode] = useState(false);

  const handleDelete = () => {
    if ((focusElement as FocusElementTransform).element.attrs.name === "room") {
      deleteRoom(Number((focusElement as FocusElementTransform).element.attrs.id));
    }
    if ((focusElement as FocusElementTransform).element.attrs.name === "desk") {
      deleteDesk(Number((focusElement as FocusElementTransform).element.attrs.id));
    }
    updateFocusElement(undefined);
  };

  const canvas = document.querySelector("#createMapStage");
  const offsetLeft = (canvas as HTMLDivElement)?.offsetLeft;
  const offsetTop = editMode
    ? (canvas as HTMLDivElement)?.offsetTop - 235
    : (canvas as HTMLDivElement)?.offsetTop;

  return (
    <div
      style={{
        position: "absolute",
        top: ((focusElement as FocusElementTransform)?.y || (focusElement as FocusElementTransform)?.element.attrs.y) + offsetTop - 30,
        left: ((focusElement as FocusElementTransform)?.x || (focusElement as FocusElementTransform)?.element.attrs.x) + offsetLeft,
        padding: "5px 5px",
        borderRadius: "3px",
        boxShadow: "0 0 3px grey",
        zIndex: 10,
        backgroundColor: "white",
      }}
      className="popup"
      onClick={(e) => e.stopPropagation()}
    >
      {editMode && (
        <RoomInfoForm
          quitEditMode={() => setEditMode(false)}
          id={Number((focusElement as FocusElementTransform)?.element.attrs.id)}
        />
      )}
      <div className="flex gap-2">
        <Trash2 size={16} className="trash-hover" onClick={handleDelete} />
        {(focusElement as FocusElementTransform)?.element.attrs.name === "room" && (
          <Pencil
            size={16}
            className="cursor-pointer hover:text-blue-800"
            onClick={() => setEditMode(!editMode)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateMapPopup;
