import { useEffect } from 'react';

const BlockDevTools = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F12") {
        event.preventDefault();
      }
      if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
      }
      if (event.ctrlKey && event.shiftKey && event.key === "C") {
        event.preventDefault();
      }
      if (event.ctrlKey && event.shiftKey && event.key === "J") {
        event.preventDefault();
      }
      if (event.ctrlKey && event.key === "U") {
        event.preventDefault();
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
};

export default BlockDevTools;
