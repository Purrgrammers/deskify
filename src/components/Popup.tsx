import { MapContext } from "@/contexts/MapContext";
import { Trash2 } from "lucide-react";
import { useContext } from "react";

type PopupProps = {
    position: {
        x: number
        y: number
    }
    type: string
    id: number
    updateFocus: () => void
}

const Popup = ({position, type, id, updateFocus}: PopupProps) => {
    const { deleteRoom, deleteDesk } = useContext(MapContext)
    const handleDelete = () => {
        if(type === 'room'){
            deleteRoom(id)
        }
        if(type === 'desk'){
            deleteDesk(id)
        }
        updateFocus()
    }

    const canvas = document.querySelector('#createMapStage')
    const offsetLeft = (canvas as HTMLDivElement)?.offsetLeft
    const offsetTop = (canvas as HTMLDivElement)?.offsetTop


  return (
    <div
    style={{
        position: "absolute",
        top: position.y + offsetTop - 30,
        left: position.x + offsetLeft,
        padding: "5px 10px",
        borderRadius: "3px",
        boxShadow: "0 0 3px grey",
        zIndex: 10,
        backgroundColor: "white"
      }}
    >
      <Trash2 size={16} className="trash-hover" onClick={handleDelete}/>
    </div>
  );
};

export default Popup;
