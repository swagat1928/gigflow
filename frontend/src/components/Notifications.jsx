import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("hired", (data) => {
      setNotifications(prev => [...prev, data.message]);
    });

    return () => {
      socket.off("hired");
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 space-y-2">
      {notifications.map((msg, i) => (
        <div
          key={i}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          {msg}
        </div>
      ))}
    </div>
  );
}
