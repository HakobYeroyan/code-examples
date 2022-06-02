import { useState } from 'react';
import { socket } from "@shared/Socket/socket";


let typingTimeOut;
let notTypingTimeout;

const useTypingIndicator = (key) => {
  const [pressed, SetPressed] = useState(false);

  const handleKeyDown = (e) => {
    if (e.keyCode !== 13 && e.keyCode !== 8) {
      if (!pressed) {
        typingTimeOut = setTimeout(() => {
          socket.emit('typing', { id: socket.id, typing: { [key]: true } });
        }, 600);
        SetPressed(true);
      }
    }

  };

  const handleKeyUp = () => {
    clearTimeout(notTypingTimeout);
    if (pressed) {
      notTypingTimeout = setTimeout(() => {
        SetPressed(false);
        socket.emit('typing', { id: socket.id, typing: { [key]: false } });
      }, 3000);

    }
  };

  return {
    onKeyUp: handleKeyUp,
    onKeyDown: handleKeyDown,
  }
};

export default useTypingIndicator;