import { Modal } from "antd";
import { useEffect } from "react";

const useFullScreenPage = () => {
    
    const enterFullscreen = () => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if ((element as any).mozRequestFullScreen) { // Firefox
          (element as any).mozRequestFullScreen();
        } else if ((element as any).webkitRequestFullscreen) { // Chrome, Safari, Opera
          (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) { // Internet Explorer
          (element as any).msRequestFullscreen();
        }
    };

    const info = () => {
        Modal.info({
          title: "Test vaqtida sahifa to'liq ochilgan holatda bo'lishi kerak!",
          content: "",
          onOk() {
            enterFullscreen();
          },
        });
    };

    useEffect(() => {
        if(!document.fullscreenElement){
            info()
        }
    }, [document.fullscreenElement]);
}

export default useFullScreenPage;