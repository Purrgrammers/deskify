import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./ui/button"
import { SyntheticEvent, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { MapContext, Room } from "@/contexts/MapContext"
import { Label } from "./ui/label"

type RoomInfoProps = {
    quitEditMode: () => void
    id: number
}

const RoomInfoForm = ({quitEditMode, id}: RoomInfoProps) => {
    const { rooms, updateRooms } = useContext(MapContext)
    const [ roomInfo, setRoomInfo ] = useState<Room>()

    useEffect(() => {
      const room = rooms.find((room) => room.id === id)
      setRoomInfo(room)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rooms, focus])

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const name = (form.elements.namedItem('input-name') as HTMLInputElement).value
        const seats = Number((form.elements.namedItem('input-seats') as HTMLInputElement).value)
        const additionalInfo = (form.elements.namedItem('input-additional-info') as HTMLInputElement).value

        const updatedRoomIndex = rooms.findIndex((room) => room.id === id);
        rooms[updatedRoomIndex] = {
          ...rooms[updatedRoomIndex],
          name,
          seats,
          additionalInfo,
        };
        updateRooms(rooms);
        toast.success("Room info has been saved!");
        quitEditMode()
    }

  return (
    <form className="flex flex-col gap-2 mb-4" onSubmit={(e) => handleSubmit(e)}>
        <Label htmlFor="input-name" className="ml-px mt-px">Room name</Label>
       <Input type="text" name='input-name' id='input-name' defaultValue={roomInfo?.name || ''}/>
       <Label htmlFor="input-seats" className="ml-px mt-px">Number of seats</Label>
       <Input type="number" name='input-seats' id='input-seats' defaultValue={roomInfo?.seats || ''}/>
       <Label htmlFor="input-additional-info" className="ml-px mt-px">Additional information</Label>
       <Textarea name='input-additional-info' id='input-additional-info' defaultValue={roomInfo?.additionalInfo || ''}/>
       <div className="flex gap-2 place-content-end">
       <Button size='xs' className="text-xs" variant="outline" onClick={() => quitEditMode()}>Cancel</Button>
       <Button size='xs' className="text-xs" type="submit">Save</Button>
       </div>
    </form>
  )
}

export default RoomInfoForm