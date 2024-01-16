export const showPopup = (show: boolean) => {
    const popup = document.querySelector(".popup");
    if (show) {
      popup?.classList.remove("popup-hidden");
    } else {
      popup?.classList.add("popup-hidden");
    }
  }