import { MapContext } from "@/contexts/MapContext";
import { Pencil, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import RoomInfoForm from "./RoomInfoForm";


const Popup = () => {
    const { deleteRoom, deleteDesk, focus, updateFocus } = useContext(MapContext)
    const [editMode, setEditMode] = useState(false)
    
    const handleDelete = () => {
        if(focus?.element.attrs.name === 'room'){
            deleteRoom(Number(focus.element.attrs.id))
        }
        if(focus?.element.attrs.name === 'desk'){
            deleteDesk(Number(focus.element.attrs.id))
        }
        updateFocus(null)
    }

    const canvas = document.querySelector('#createMapStage')
    const offsetLeft = (canvas as HTMLDivElement)?.offsetLeft
    const offsetTop = (canvas as HTMLDivElement)?.offsetTop


  return (
    <div
    style={{
        position: "absolute",
        top: (focus?.y || Number(focus?.element.attrs.y)) + offsetTop - 30,
        left: (focus?.x || Number(focus?.element.attrs.x)) + offsetLeft,
        padding: "5px 5px",
        borderRadius: "3px",
        boxShadow: "0 0 3px grey",
        zIndex: 10,
        backgroundColor: "white"
      }}
    >
      {editMode && <RoomInfoForm quitEditMode={() => setEditMode(false)} id={Number(focus?.element.attrs.id)}/>}
      <div className="flex gap-2">
      <Trash2 size={16} className="trash-hover" onClick={handleDelete}/>
      <Pencil size={16} className="cursor-pointer hover:text-blue-800" onClick={() => setEditMode(!editMode)} />
      </div>
    </div>
  );
};

export default Popup;
