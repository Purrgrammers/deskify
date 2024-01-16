import { FocusElementBook, MapContext } from "@/contexts/MapContext";
import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";


const BookDeskPopup = ({mapId}: {mapId: number}) => {
    const { focusElement, updateFocusElement, bookDesk, bookRoom } = useContext(MapContext)
    const [ popupHeight, setPopupHeight] = useState(0)
    const canvas = document.querySelector('#bookDeskStage')
    const offsetLeft = (canvas as HTMLDivElement)?.offsetLeft
    const offsetTop =  (canvas as HTMLDivElement)?.offsetTop
    const popupElement = document.querySelector('#bookDeskPopup') as HTMLDivElement

    useEffect(() => {
      if(popupElement){
        setPopupHeight(popupElement.offsetHeight)
      }
    }, [popupElement, focusElement])

    const { type, id, y, x, name, seats, additionalInfo, booked } = (focusElement as FocusElementBook)

    const handleBooking = () => {
      if(type === 'Room') {
        bookRoom(id, mapId)
      }
      if(type === 'Desk') {
        bookDesk(id, mapId)
      }
    }
  return (
    <div
    style={{
        position: "absolute",
        maxWidth: 180,
        top: (y || 10) + offsetTop - (popupHeight + 4),
        left: (x || 10) + offsetLeft,
        padding: "5px 5px",
        borderRadius: "3px",
        boxShadow: "0 0 3px grey",
        zIndex: 10,
        backgroundColor: "white",
      }}
      className={popupHeight? 'popup' : 'popup-hidden popup'}
      id="bookDeskPopup"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
      <p className="text-sm">{name? `${name}: `: `${type} ${id}: `} <span className={booked? 'text-red-600': 'text-green-600'}>{booked? 'Booked': 'Available'}</span></p>
      {seats && <p className="text-xs"><span className="font-semibold">Number of seats:</span> {seats}</p>}
      {additionalInfo && <p className="text-xs"><span className="font-semibold">Additional information:</span> {additionalInfo}</p>}
      <div className="flex gap-2 justify-end">
      <Button className="mt-2" size='xs' variant='outline' onClick={() => updateFocusElement(undefined)}>Close</Button>
      <Button disabled={booked? true : false} className="mt-2" size='xs' onClick={handleBooking}>Book</Button>
      </div>
      </div>
    </div>
  );
};

export default BookDeskPopup;
