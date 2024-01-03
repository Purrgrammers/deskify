import { MapContext } from "@/contexts/MapContext";
import { Trash2 } from "lucide-react";
import { useContext } from "react";

type PopupProps = {
    position: number
    type: string
    id: number
}

const Popup = ({position, type, id}: PopupProps) => {

    const { deleteRoom, deleteDesk } = useContext(MapContext)

    const handleDelete = () => {
        if(type === 'room'){
            deleteRoom(id)
        }
        if(type === 'desk'){
            deleteDesk(id)
        }
    }

  return (
    <div
    style={{
        position: "absolute",
        top:  position + 20 + "px",
        left: position + 20 + "px",
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
