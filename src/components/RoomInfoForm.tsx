import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { SyntheticEvent } from "react"


const RoomInfoForm = () => {

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
    }
  return (
    <form className="flex flex-col gap-2 mb-4" onSubmit={(e) => handleSubmit(e)}>
       <Input type="text" placeholder="Room name"/>
       <Input type="number" placeholder="Number of seats"/>
       <Input type="text" placeholder="Additional information"/>
       <div className="flex gap-2 place-content-end">
       <Button size='xs' className="w-10 text-xs" variant="secondary">Cancel</Button>
       <Button size='xs' className="w-10 text-xs" type="submit">Save</Button>
       </div>
    </form>
  )
}

export default RoomInfoForm