import { MapContext } from "@/contexts/MapContext";
import { Trash2 } from "lucide-react";
import { useContext } from "react";


const Popup = () => {
    const { deleteRoom, deleteDesk, focus, updateFocus } = useContext(MapContext)
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
        top: (focus?.y || focus?.element.attrs.y) + offsetTop - 30,
        left: (focus?.x || focus?.element.attrs.x) + offsetLeft,
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
