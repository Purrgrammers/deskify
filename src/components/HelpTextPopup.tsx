

const HelpTextPopup = ({type, x}: {type: string, x: number}) => {
    const canvas = document.querySelector('#createMapStage')
    const offsetLeft = (canvas as HTMLDivElement)?.offsetLeft
    const offsetTop = (canvas as HTMLDivElement)?.offsetTop

  return (
    <div
    style={{
        position: "absolute",
        maxWidth: 180,
        top: 50 + offsetTop - 30,
        left: x + offsetLeft,
        padding: "5px 5px",
        borderRadius: "3px",
        boxShadow: "0 0 3px grey",
        zIndex: 10,
        backgroundColor: "white",
      }}
      id="bookDeskPopup"
    >
      <div className="flex flex-col gap-1 text-xs">
        <p>Drag to place {type}</p>
      </div>
    </div>
  );
};

export default HelpTextPopup;
