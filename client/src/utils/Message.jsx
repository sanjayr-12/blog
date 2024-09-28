import { useEffect, useState } from "react";
import "./Message.css";

// eslint-disable-next-line react/prop-types
const Message = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  return <div className={`message ${type}`}>{message}</div>;
};

export default Message;
