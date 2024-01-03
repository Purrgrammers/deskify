import { Trash2 } from "lucide-react";

type PopupProps = {
    position: number
    type: string
    id: number
}

const Popup = ({position, type, id}: PopupProps) => {
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
      <Trash2 size={16} className="trash-hover" />
    </div>
  );
};

export default Popup;
