import { useEffect } from "react";

const useBlockContextMenuAndF12 = () => {
    
  useEffect(() => {
    const handleContextMenu = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
      if (event.key === 'F12') {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

export default useBlockContextMenuAndF12;